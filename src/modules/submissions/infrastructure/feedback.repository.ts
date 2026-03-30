import { Feedback } from "../domain/feedback.entity";

export interface FeedbackRepository{
  create(feedback: Feedback): Promise<Feedback>;
  getFeedbackBySubmission(submissionId: number): Promise<Feedback|null>;
  update(feedback: Feedback,submissionId:number): Promise<Feedback>;
  delete(submissionId:number): void;
}