-- AlterTable
ALTER TABLE "subscriptions_details" ADD COLUMN     "answer_question" TEXT;

-- CreateTable
CREATE TABLE "encrypted_fields" (
    "id" SERIAL NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" INTEGER NOT NULL,
    "field_name" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "encrypted_fields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "encrypted_fields" ADD CONSTRAINT "encrypted_fields_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "subscriptions_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
