import { Prisma } from "@prisma/client";

export type SubmissionDetail = Prisma.SubmissionGetPayload<{
  include: {
    codeSubmissions: true,
    assignment: {
      select: {
        due_at: true
      }
    },
    feedback: true,
  }
}>

export type CodeSubmissionDetail = Prisma.CodeSubmissionGetPayload<{
  include: {
    feedbackChallenge: true,
    assignmentChallenge: true,
  }
}>