-- AlterTable
ALTER TABLE "encrypted_fields" ADD COLUMN     "record_recovery_id" INTEGER,
ALTER COLUMN "record_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "encrypted_fields" ADD CONSTRAINT "encrypted_fields_record_recovery_id_fkey" FOREIGN KEY ("record_recovery_id") REFERENCES "recovery_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
