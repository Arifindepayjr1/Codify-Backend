import { Submission } from "../domain/submission.entity";
import { CodeSubmissionDetail, SubmissionDetail } from "../submission.types";

export interface SubmissionRepository {
  create(submission: Submission): Promise<Submission>;
  findById(id: number): Promise<Submission | null>;
  findSubmissionDetail(id: number): Promise<SubmissionDetail | null>;
  findCodeSubmissionDetail(id: number): Promise<CodeSubmissionDetail | null>;
  findByAssignment(assignmentId: number): Promise<Submission[]>;
  update(submission: Submission): Promise<Submission>;
}