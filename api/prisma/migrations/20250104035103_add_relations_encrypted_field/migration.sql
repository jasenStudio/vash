-- AddForeignKey
ALTER TABLE "encrypted_fields" ADD CONSTRAINT "unique_record_id_constraint" FOREIGN KEY ("record_id") REFERENCES "recovery_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
