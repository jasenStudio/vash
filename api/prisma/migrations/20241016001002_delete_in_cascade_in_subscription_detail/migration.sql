-- DropForeignKey
ALTER TABLE "recovery_methods" DROP CONSTRAINT "recovery_methods_subscription_detail_id_fkey";

-- AddForeignKey
ALTER TABLE "recovery_methods" ADD CONSTRAINT "recovery_methods_subscription_detail_id_fkey" FOREIGN KEY ("subscription_detail_id") REFERENCES "subscriptions_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
