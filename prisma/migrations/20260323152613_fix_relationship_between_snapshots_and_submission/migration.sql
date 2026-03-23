/*
  Warnings:

  - You are about to drop the column `challenge_id` on the `CodeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `submission_id` on the `TestCaseResult` table. All the data in the column will be lost.
  - Added the required column `assignment_challenge_id` to the `CodeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code_submission_id` to the `TestCaseResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CodeSubmission" DROP CONSTRAINT "CodeSubmission_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "TestCaseResult" DROP CONSTRAINT "TestCaseResult_case_id_fkey";

-- DropForeignKey
ALTER TABLE "TestCaseResult" DROP CONSTRAINT "TestCaseResult_submission_id_fkey";

-- AlterTable
ALTER TABLE "CodeSubmission" DROP COLUMN "challenge_id",
ADD COLUMN     "assignment_challenge_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "total_score" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "submission_id",
ADD COLUMN     "code_submission_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CodeSubmission" ADD CONSTRAINT "CodeSubmission_assignment_challenge_id_fkey" FOREIGN KEY ("assignment_challenge_id") REFERENCES "AssignmentChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseResult" ADD CONSTRAINT "TestCaseResult_code_submission_id_fkey" FOREIGN KEY ("code_submission_id") REFERENCES "CodeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseResult" ADD CONSTRAINT "TestCaseResult_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "AssignmentTestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
