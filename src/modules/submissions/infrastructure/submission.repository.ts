import { Submission } from "../domain/submission.entity";
import { SubmissionDetail } from "../submission.types";

export interface SubmissionRepository {
  create(submission: Submission): Promise<Submission>;
  findById(id: number): Promise<Submission | null>;
  findSubmissionDetail(id: number): Promise<SubmissionDetail | null>;
  findByAssignment(assignmentId: number): Promise<Submission[]>;
  update(submission: Submission): Promise<Submission>;
}