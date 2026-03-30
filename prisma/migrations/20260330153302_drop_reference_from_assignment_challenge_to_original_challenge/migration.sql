/*
  Warnings:

  - Added the required column `original_title` to the `AssignmentChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssignmentChallenge" DROP CONSTRAINT "AssignmentChallenge_original_challenge_id_fkey";

-- DropIndex
DROP INDEX "AssignmentChallenge_assignment_id_original_challenge_id_key";

-- AlterTable
ALTER TABLE "AssignmentChallenge" ADD COLUMN     "original_title" TEXT NOT NULL,
ADD COLUMN     "tag_name" TEXT,
ALTER COLUMN "original_challenge_id" DROP NOT NULL;
