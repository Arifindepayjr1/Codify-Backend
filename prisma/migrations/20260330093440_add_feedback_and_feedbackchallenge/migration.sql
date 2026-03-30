-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackChallenge" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "code_submission_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_submission_id_key" ON "Feedback"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackChallenge_code_submission_id_key" ON "FeedbackChallenge"("code_submission_id");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackChallenge" ADD CONSTRAINT "FeedbackChallenge_code_submission_id_fkey" FOREIGN KEY ("code_submission_id") REFERENCES "CodeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
