/*
  Warnings:

  - You are about to drop the column `iv` on the `subscriptions_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `subscriptions_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions_details" DROP COLUMN "iv",
DROP COLUMN "tag";
