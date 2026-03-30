export class AssignmentChallengeFeedback {
  constructor(
    public readonly id: number | null,
    public teacherId: number,
    public codeSubmissionId: number,
    public feedback: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  static create(props: {
    teacherId: number;
    codeSubmissionId: number;
    feedback: string;
  }): AssignmentChallengeFeedback {
    const now = new Date();
    return new AssignmentChallengeFeedback(
      null,
      props.teacherId,
      props.codeSubmissionId,
      props.feedback,
      now,
      now
    );
  }

  static rehydrate(props: {
    id: number;
    teacherId: number;
    codeSubmissionId: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
  }): AssignmentChallengeFeedback {
    return new AssignmentChallengeFeedback(
      props.id,
      props.teacherId,
      props.codeSubmissionId,
      props.feedback,
      props.createdAt,
      props.updatedAt
    );
  }
}