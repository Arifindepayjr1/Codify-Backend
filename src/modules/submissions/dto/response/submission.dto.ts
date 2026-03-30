import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { SubmissionStatus } from "@prisma/client";
import { CodeSubmissionDto } from "./code-submission.dto";

@ApiSchema({ name: 'Submission' })
export class SubmissionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  assignmentId: number;

  @ApiProperty({ example: 'NOT SUBMITTED' })
  status: string;

  @ApiProperty({ example: 0 })
  totalScore: number;

  @ApiProperty({
    example: null,
    required: false,   
    nullable: true
  })
  submittedAt: Date | undefined;

  @ApiProperty({ example: 'AMAZOON' })
  feedback: string | undefined;
  // @ApiProperty({ example: '2026-03-23T16:05:01.780Z' })
  // createdAt: string;

  // @ApiProperty({ example: '2026-03-23T16:05:01.780Z' })
  // updatedAt: string;

  @ApiProperty({ type: [CodeSubmissionDto] })
  codeSubmissions: CodeSubmissionDto[];
}