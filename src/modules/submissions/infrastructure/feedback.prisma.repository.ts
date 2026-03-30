import { Injectable, NotFoundException } from "@nestjs/common";
import { FeedbackRepository } from "./feedback.repository";
import { Feedback } from "../domain/feedback.entity";
import { PrismaService } from "prisma/prisma.service";
import { AssignmentChallengeFeedback } from "../domain/assignmentChallengeFeedback.entity";

@Injectable()
export class FeedbackPrismaRepository implements FeedbackRepository{
  constructor(
    private readonly prisma : PrismaService
  ) { }
  async create(feedback: Feedback): Promise<Feedback> {
    const result = await this.prisma.feedback.create({
      data: {
        teacher_id: feedback.teacherId,
        submission_id: feedback.submissionId,
        text: feedback.feedback
      }
    });

    return Feedback.rehydrate({
      id: result.id,
      teacherId: result.teacher_id,
      submissionId: result.submission_id,
      feedback: result.text,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    });
  }
  
  async findBySubmissionId(id: number): Promise<Feedback | null> {
    const result = await this.prisma.feedback.findUnique({
      where: { id }
    });

    return result ? Feedback.rehydrate({
      teacherId: result.teacher_id,
      submissionId: result.submission_id,
      feedback: result.text,
      id: result.id,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }) : null;
  }

  async update(feedback: Feedback, submissionId: number): Promise<Feedback> {
    const result = await this.prisma.feedback.update({
      where: { submission_id: submissionId },
      data: {
        text: feedback.feedback,
        updated_at: feedback.updatedAt
      }
    });

    return Feedback.rehydrate({
      id: result.id,
      teacherId: result.teacher_id,
      submissionId: result.submission_id,
      feedback: result.text,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    });
  }

  async delete(submissionId: number): Promise<void> {
    await this.prisma.feedback.delete({
      where: { submission_id: submissionId }
    });
  }

  async createChallengeFeedback(
    feedback: AssignmentChallengeFeedback,
    codeSubmissionId: number
  ): Promise<AssignmentChallengeFeedback> {
    const result = await this.prisma.feedbackChallenge.create({
      data: {
        teacher_id: feedback.teacherId,
        code_submission_id: codeSubmissionId,
        text: feedback.feedback,
      },
    });

    return AssignmentChallengeFeedback.rehydrate({
      id: result.id,
      teacherId: result.teacher_id,
      codeSubmissionId: result.code_submission_id,
      feedback: result.text,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
  
  async findByCodeSubmissionId(
    codeSubmissionId: number
  ): Promise<AssignmentChallengeFeedback | null> {
    const result = await this.prisma.feedbackChallenge.findUnique({
      where: { code_submission_id: codeSubmissionId },
    });

    return result
      ? AssignmentChallengeFeedback.rehydrate({
          id: result.id,
          teacherId: result.teacher_id,
          codeSubmissionId: result.code_submission_id,
          feedback: result.text,
          createdAt: result.created_at,
          updatedAt: result.updated_at,
        })
      : null;
  }
  
  async updateChallengeFeedback(
    feedback: AssignmentChallengeFeedback,
    codeSubmissionId: number
  ): Promise<AssignmentChallengeFeedback> {
    const result = await this.prisma.feedbackChallenge.update({
      where: { code_submission_id: codeSubmissionId },
      data: {
        text: feedback.feedback,
        updated_at: feedback.updatedAt,
      },
    });

    return AssignmentChallengeFeedback.rehydrate({
      id: result.id,
      teacherId: result.teacher_id,
      codeSubmissionId: result.code_submission_id,
      feedback: result.text,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  async deleteChallengeFeedback(codeSubmissionId: number): Promise<void> {
    await this.prisma.feedbackChallenge.delete({
      where: { code_submission_id: codeSubmissionId },
    });
  }
}