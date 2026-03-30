import { AssignmentChallengeFeedback } from "../domain/assignmentChallengeFeedback.entity";
import { Feedback } from "../domain/feedback.entity";

export interface FeedbackRepository{
  create(feedback: Feedback): Promise<Feedback>;
  findBySubmissionId(id: number): Promise<Feedback | null>;
  update(feedback: Feedback, submissionId: number): Promise<Feedback>;
  delete(submissionId:number): Promise<void>;

  createChallengeFeedback(feedback: AssignmentChallengeFeedback, codeSubmissionId: number): Promise<AssignmentChallengeFeedback>;
  findByCodeSubmissionId(codeSubmissionId: number): Promise<AssignmentChallengeFeedback | null>;
  updateChallengeFeedback(feedback: AssignmentChallengeFeedback, codeSubmissionId: number): Promise<AssignmentChallengeFeedback>;
  deleteChallengeFeedback(codeSubmissionId: number): Promise<void>;
}