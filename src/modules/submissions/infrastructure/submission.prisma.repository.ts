import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Submission } from "../domain/submission.entity";
import { SubmissionRepository } from "./submission.repository";
import { CodeSubmission } from "../domain/challengeSubmission.entity";
import { SubmissionDetail } from "../submission.types";
import { SubmissionStatus } from "@prisma/client";

@Injectable()
export class SubmissionPrismaRepository implements SubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(submission: Submission): Promise<Submission> {
    const created = await this.prisma.submission.create({
      data: {
        user_id: submission.userId,
        assignment_id: submission.assignmentId,
        status: submission.status,
        total_score: submission.totalScore,
        submitted_at: submission.submittedAt,
        created_at: submission.createdAt,
        updated_at: submission.updatedAt,
        codeSubmissions: {
          create: submission.codeSubmissions.map(cs => ({
            code: cs.code,
            assignmentChallenge: {
              connect: { id: cs.challengeId }
            }            
          })),
        },
      },
      include: {
        codeSubmissions: true,
      },
    });

    return Submission.rehydrate({
      id: created.id,
      userId: created.user_id,
      assignmentId: created.assignment_id,
      status: created.status as SubmissionStatus,
      totalScore: created.total_score,
      submittedAt: created.submitted_at,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
      codeSubmissions: created.codeSubmissions.map(cs => ({
        id: cs.id,
        challengeId: cs.assignment_challenge_id,
        code: cs.code,
      })),
    });
  }

  async findById(id: number): Promise<Submission | null> {
    const found = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        codeSubmissions: true,
      }
    });

    if (!found) return null;

    return Submission.rehydrate({
      id: found.id,
      userId: found.user_id,
      assignmentId: found.assignment_id,
      status: found.status as SubmissionStatus,
      totalScore: found.total_score,
      submittedAt: found.submitted_at,
      createdAt: found.created_at,
      updatedAt: found.updated_at,
      codeSubmissions: found.codeSubmissions.map(cS => {
        return CodeSubmission.rehydrate({
          id: cS.id,
          challengeId: cS.assignment_challenge_id,
          code: cS.code
        });
      }),
    });
  }

  async findSubmissionDetail(id: number): Promise<SubmissionDetail | null> {
    const result = await this.prisma.submission.findFirst({
      where: { id },
      include: {
        codeSubmissions: true,
        assignment: {
          select: {
            due_at: true
          }
        }
      }
    });

    return result;
  }

  async findByAssignment(assignmentId: number): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
      where: { assignment_id: assignmentId },
      include: { 
        codeSubmissions: true
      }
    });

    return submissions.map(s =>
      Submission.rehydrate({
        id: s.id,
        userId: s.user_id,
        assignmentId: s.assignment_id,
        status: s.status as SubmissionStatus,
        totalScore: s.total_score,
        submittedAt: s.submitted_at,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        codeSubmissions: s.codeSubmissions.map(cS => {
          return CodeSubmission.rehydrate({
            id: cS.id,
            challengeId: cS.assignment_challenge_id,
            code: cS.code
          });
        }),
      }),
    );
  }

  async update(submission: Submission): Promise<Submission> {
    const updated = await this.prisma.submission.update({
      where: { id: submission.id! },
      include: {
        codeSubmissions: true
      },
      data: {
        status: submission.status,
        submitted_at: submission.submittedAt,
        updated_at: new Date(),
      },
    });

    return Submission.rehydrate({
      id: updated.id,
      userId: updated.user_id,
      assignmentId: updated.assignment_id,
      status: updated.status as SubmissionStatus,
      totalScore: updated.total_score,
      submittedAt: updated.submitted_at,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
      codeSubmissions: updated.codeSubmissions.map(cS => {
        return CodeSubmission.rehydrate({
          id: cS.id,
          challengeId: cS.assignment_challenge_id,
          code: cS.code
        });
      }),
    });
  }
}