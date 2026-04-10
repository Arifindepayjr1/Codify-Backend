import { Injectable, OnModuleInit } from "@nestjs/common";
import { Worker } from "bullmq";
import Docker from "dockerode";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from "@nestjs/config";
import type { TestCodeResult } from "./interfaces/test-code-result.interface";

type Language = "python" | "c";

interface ContainerRunOptions {
    language: Language;
    baseFilename: string;
    outBinary: string;
    input: string;
    timeoutMs: number;
}

interface ContainerRunResult {
    output: string;
    statusCode: number;
    timedOut: boolean;
}

@Injectable()
export class CodeRunnerProcessor implements OnModuleInit {

    private worker!: Worker;
    private docker: Docker;

    constructor(private configService: ConfigService) {
        const hasRedisHost = configService.get("REDIS_HOST") != null;
        this.docker = hasRedisHost
            ? new Docker({ socketPath: "/var/run/docker.sock" })
            : new Docker();
    }

    onModuleInit() {
        this.worker = new Worker(
            "codifyQueue",
            async (job) => {
                if (job.name === "test-code") {
                    return this.processTestJob(job);
                }
                return this.processJob(job);
            },
            {
                connection: {
                    host: this.configService.get("REDIS_HOST") || "127.0.0.1",
                    port: this.configService.get("REDIS_PORT") || 6379,
                },
                concurrency: 10,
            }
        );

        this.worker.on("failed", (job, err) => {
            console.error(`Job ${job?.id} failed:`, err.message);
        });

        this.worker.on("completed", (job) => {
            console.log(`Job ${job?.id} completed`);
        });
    }

    // Shared Helpers 

    /** Resolve the temp directory and Docker bind mount based on environment. */
    private resolveCodeEnv(): { codeDir: string; binds: string[] } {
        const isDocker = fs.existsSync("/.dockerenv");
        const codeDir = isDocker ? "/code-temp" : process.cwd();
        const binds = isDocker
            ? [`${this.configService.get("CODE_RUNNER_VOLUME_NAME")}:/code-temp:rw`]
            : [`${process.cwd()}:/code-temp:rw`];
        return { codeDir, binds };
    }

    /** Write the user's code to a temp file, returning the full path. */
    private writeCodeFile(codeDir: string, baseFilename: string, code: string): string {
        const filename = path.join(codeDir, baseFilename);
        fs.writeFileSync(filename, code);
        return filename;
    }

    /** Clean up temp files, ignoring errors if they don't exist. */
    private cleanupFiles(...filePaths: string[]): void {
        for (const filePath of filePaths) {
            try { fs.unlinkSync(filePath); } catch { }
        }
    }

    /** Build the Docker run command based on language. */
    private buildRunCommand(language: Language, baseFilename: string, outBinary: string, safeInput: string): string[] {
        switch (language) {
            case "python":
                return ["bash", "-c", `printf "${safeInput}" | python3 /code-temp/${baseFilename}`];
            case "c":
                return ["bash", "-c", `gcc /code-temp/${baseFilename} -o /tmp/${outBinary} -lm && printf "${safeInput}" | /tmp/${outBinary}`];
        }
    }

    /** Build the Docker run command for processJob (copies to /tmp first). */
    private buildRunCommandWithCopy(language: Language, baseFilename: string, outBinary: string, safeInput: string): string[] {
        switch (language) {
            case "python":
                return ["bash", "-c", `cp /code-temp/${baseFilename} /tmp/${baseFilename} && printf "${safeInput}" | python3 /tmp/${baseFilename}`];
            case "c":
                return ["bash", "-c", `cp /code-temp/${baseFilename} /tmp/${baseFilename} && gcc /tmp/${baseFilename} -o /tmp/${outBinary} -lm && printf "${safeInput}" | /tmp/${outBinary}`];
        }
    }

    /** Escape user input for safe shell injection. */
    private escapeInput(input: string): string {
        return input.replace(/"/g, '\\"').replace(/`/g, "\\`");
    }

    /** Resolve the Docker image name for a given language. */
    private resolveImage(language: Language): string {
        switch (language) {
            case "python": return "code-runner-python";
            case "c": return "code-runner-c";
        }
    }

    /**
     * Core container runner — creates, starts, waits, and reads logs from a
     * Docker container, enforcing a timeout. Always removes the container on exit.
     */
    private async runContainer(cmd: string[], binds: string[], options: ContainerRunOptions): Promise<ContainerRunResult> {
        const image = this.resolveImage(options.language);

        let container: Docker.Container | null = null;
        let timedOut = false;
        let output = "";

        try {
            container = await this.docker.createContainer({
                Image: image,
                Cmd: cmd,
                HostConfig: {
                    AutoRemove: false,
                    Binds: binds,
                    Memory: 512 * 1024 * 1024,
                    CpuShares: 512,
                    NetworkMode: "none",
                },
            });

            await container.start();

            const timeout = setTimeout(async () => {
                timedOut = true;
                try { await container?.kill(); } catch { }
            }, options.timeoutMs);

            const runResult = await container.wait();
            clearTimeout(timeout);

            const logBuffer = await container.logs({
                stdout: true,
                stderr: true,
                follow: false,
            }) as unknown as Buffer;

            output = this.stripDockerLogs(logBuffer).trim();

            return { output, statusCode: runResult.StatusCode, timedOut };

        } finally {
            if (container) {
                try { await container.remove({ force: true }); } catch { }
            }
        }
    }

    // ─── Job Processors ───────────────────────────────────────────────────────

    private async processTestJob(job: any) {
        const { language, code, testCases }: { language: Language; code: string; testCases: any[] } = job.data;
        const jobId = uuidv4();

        const { codeDir, binds } = this.resolveCodeEnv();
        const ext = language === "python" ? "py" : "c";
        const baseFilename = `temp_${jobId}.${ext}`;
        const outBinary = `out_${jobId}`;
        const filename = this.writeCodeFile(codeDir, baseFilename, code);

        const results: TestCodeResult[] = [];

        try {
            for (const tc of testCases) {
                const safeInput = this.escapeInput(tc.input);
                const cmd = this.buildRunCommand(language, baseFilename, outBinary, safeInput);

                let testStatus = "ACCEPTED";
                let actual = "";

                try {
                    const { output, statusCode, timedOut } = await this.runContainer(cmd, binds, {
                        language,
                        baseFilename,
                        outBinary,
                        input: safeInput,
                        timeoutMs: 5_000,
                    });

                    if (timedOut) {
                        testStatus = "TIME_LIMIT_EXCEEDED";
                    } else if (statusCode !== 0) {
                        testStatus = "RUNTIME_ERROR";
                        actual = output;
                        console.error(`TC ${tc.id} runtime error:`, actual);
                    } else {
                        actual = output;
                    }
                } catch (err: any) {
                    testStatus = "RUNTIME_ERROR";
                    actual = err.message;
                }

                const passed = testStatus === "ACCEPTED" && actual === tc.expected_output.trim();

                results.push({
                    testCasesId: tc.id,
                    passed,
                    status: testStatus,
                    actualOutput: actual,
                    expectedOutput: tc.expected_output,
                });
            }
        } finally {
            this.cleanupFiles(filename, path.join(codeDir, outBinary));
        }

        return { results };
    }

    private async processJob(job: any) {
        const { language, code }: { language: Language; code: string } = job.data;
        const jobId = uuidv4();

        const { codeDir, binds } = this.resolveCodeEnv();
        const ext = language === "python" ? "py" : "c";
        const baseFilename = `temp_${jobId}.${ext}`;
        const outBinary = `out_${jobId}`;
        const filename = this.writeCodeFile(codeDir, baseFilename, code);

        const safeInput = this.escapeInput(job.data.input ?? "");
        const cmd = this.buildRunCommandWithCopy(language, baseFilename, outBinary, safeInput);

        try {
            const { output, timedOut } = await this.runContainer(cmd, binds, {
                language,
                baseFilename,
                outBinary,
                input: safeInput,
                timeoutMs: 10_000,
            });

            if (timedOut) {
                return { stdout: "Time limit exceeded (10s)", status: "timeout" };
            }

            return { stdout: output, status: "success" };

        } catch (err: any) {
            console.error(`Job ${jobId} error:`, err.message);
            return { stdout: err.message, status: "error" };

        } finally {
            this.cleanupFiles(filename, path.join(codeDir, outBinary));
        }
    }

    // Utils 

    private stripDockerLogs(buffer: Buffer): string {
        let result = "";
        let offset = 0;
        while (offset < buffer.length) {
            if (offset + 8 > buffer.length) break;
            const size = buffer.readUInt32BE(offset + 4);
            if (size === 0) { offset += 8; continue; }
            if (offset + 8 + size > buffer.length) break;
            result += buffer.slice(offset + 8, offset + 8 + size).toString("utf8");
            offset += 8 + size;
        }
        return result;
    }
}