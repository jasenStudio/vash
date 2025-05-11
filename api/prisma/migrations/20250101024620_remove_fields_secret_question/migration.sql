/*
  Warnings:

  - You are about to drop the column `answer_question` on the `subscriptions_details` table. All the data in the column will be lost.
  - You are about to drop the column `secret_question` on the `subscriptions_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions_details" DROP COLUMN "answer_question",
DROP COLUMN "secret_question",
ADD COLUMN     "comment" TEXT;
