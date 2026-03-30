import { Injectable, NotFoundException } from "@nestjs/common";
import { FeedbackRepository } from "./feedback.repository";
import { Feedback } from "../domain/feedback.entity";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class FeedbackPrismaRepository implements FeedbackRepository{

  constructor(
    private readonly prisma : PrismaService
  ) {}

  create(feedback: Feedback): Promise<Feedback> {
    throw new Error("Method not implemented.");
  }
  
  async getFeedbackBySubmission(submissionId: number): Promise<Feedback|null> {

    const found = await this.prisma.feedback.findUnique(
      {
        where: {
          submission_id:submissionId
        }
      }
    )

    if (!found) {
      return null;
    }
    return Feedback.rehydrate({
      teacherId: found.teacher_id,
      submissionId: found.submission_id,
      text: found.text,
      id: found.id,
      createdAt: found.created_at,
      updatedAt: found.updated_at
    })
  }

  update(feedback: Feedback, submissionId: number): Promise<Feedback> {
    throw new Error("Method not implemented.");
  }

  delete(submissionId: number): void {
    throw new Error("Method not implemented.");
  }

}