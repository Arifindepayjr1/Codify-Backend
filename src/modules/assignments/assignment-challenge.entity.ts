import { ChallengeDifficulty } from "@prisma/client";

export class AssignmentChallenge {
  constructor(
    public readonly id: number | null,
    public assignmentId: number,
    public originalChallengeId: number | null,
    public originalTitle: string,
    public title: string,
    public description: string,
    public starterCode: string,
    public language: string,
    public difficulty: ChallengeDifficulty,
    public tagName: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: {
    assignmentId: number;
    originalChallengeId: number;
    originalTitle: string;
    title: string;
    description: string;
    starterCode: string;
    language: string;
    difficulty: ChallengeDifficulty;
    tagName: string;
  }): AssignmentChallenge {
    const now = new Date();

    return new AssignmentChallenge(
      null,
      props.assignmentId,
      props.originalChallengeId,
      props.originalTitle,
      props.title,
      props.description,
      props.starterCode,
      props.language,
      props.difficulty,
      props.tagName,
      now,
      now,
    );
  }

  static rehydrate(props: {
    id: number;
    assignmentId: number;
    originalChallengeId: number | null;
    originalTitle: string;
    title: string;
    description: string;
    starterCode: string;
    language: string;
    difficulty: ChallengeDifficulty;
    tagName: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): AssignmentChallenge {
    return new AssignmentChallenge(
      props.id,
      props.assignmentId,
      props.originalChallengeId,
      props.originalTitle,
      props.title,
      props.description,
      props.starterCode,
      props.language,
      props.difficulty,
      props.tagName,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(props: {
    title?: string;
    description?: string;
    starterCode?: string;
    language?: string;
    difficulty?: ChallengeDifficulty;
  }): void {
    if (props.title !== undefined) {
      if (props.title.trim().length < 2) {
        throw new Error('Challenge title must be at least 2 characters long');
      }
      this.title = props.title;
    }

    if (props.description !== undefined) {
      this.description = props.description;
    }

    if (props.starterCode !== undefined) {
      this.starterCode = props.starterCode;
    }

    if (props.language !== undefined) {
      this.language = props.language;
    }

    if (props.difficulty !== undefined) {
      this.difficulty = props.difficulty;
    }

    this.updatedAt = new Date();
  }
}