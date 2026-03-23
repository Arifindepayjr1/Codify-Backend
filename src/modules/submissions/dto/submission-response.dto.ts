import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { SubmissionStatus } from "@prisma/client";
import { CodeSubmissionResponseDto } from "./code-submission-response.dto";

@ApiSchema({ name: 'Submission' })
export class SubmissionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  assignmentId: number;

  @ApiProperty({ enum: SubmissionStatus, example: SubmissionStatus.DRAFT })
  status: SubmissionStatus;

  @ApiProperty({ example: 0 })
  totalScore: number;

  @ApiProperty({ example: '2026-03-23T16:05:01.822Z' })
  submittedAt: string;

  @ApiProperty({ example: '2026-03-23T16:05:01.780Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-23T16:05:01.780Z' })
  updatedAt: string;

  @ApiProperty({ type: [CodeSubmissionResponseDto] })
  codeSubmissions: CodeSubmissionResponseDto[];
}