/*
  Warnings:

  - Added the required column `type` to the `revoked_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH');

-- AlterTable
ALTER TABLE "revoked_tokens" ADD COLUMN     "type" "TokenType" NOT NULL;
