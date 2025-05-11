/*
  Warnings:

  - You are about to drop the column `subcription_id` on the `subscriptions_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscription_id]` on the table `subscriptions_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscription_id` to the `subscriptions_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions_details" DROP CONSTRAINT "subscriptions_details_subcription_id_fkey";

-- DropIndex
DROP INDEX "subscriptions_details_subcription_id_key";

-- AlterTable
ALTER TABLE "subscriptions_details" DROP COLUMN "subcription_id",
ADD COLUMN     "subscription_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_details_subscription_id_key" ON "subscriptions_details"("subscription_id");

-- AddForeignKey
ALTER TABLE "subscriptions_details" ADD CONSTRAINT "subscriptions_details_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
