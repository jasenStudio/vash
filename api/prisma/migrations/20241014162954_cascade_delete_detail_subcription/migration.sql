-- DropForeignKey
ALTER TABLE "subscriptions_details" DROP CONSTRAINT "subscriptions_details_subcription_id_fkey";

-- AddForeignKey
ALTER TABLE "subscriptions_details" ADD CONSTRAINT "subscriptions_details_subcription_id_fkey" FOREIGN KEY ("subcription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
