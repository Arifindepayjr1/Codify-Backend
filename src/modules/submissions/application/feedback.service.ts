import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { FeedbackRepository } from "../infrastructure/feedback.repository";
import { SubmissionService } from "./submission.service";

@Injectable()
export class FeedbackService{

  constructor(
    private readonly submissionService:SubmissionService,
    @Inject('FeedbackRepository')
    private readonly repo:FeedbackRepository
  ){}

  async getFeedback(
    submissionId:number,
    userId: number
  ) {

    const feedback = await this.repo.getFeedbackBySubmission(submissionId); 
    if (!feedback) {
      throw new NotFoundException("Feedback not found");
    }
  
    return (feedback);
  }

  async createFeedback(
    classroomId: number,
    assignmentId:number,
    submissionId: number,
    teacherId:number,
  ) {
    return this.submissionService.getSubmission(
      classroomId,
      assignmentId,
      submissionId,
      teacherId
    )
  }

}