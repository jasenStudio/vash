/*
  Warnings:

  - Added the required column `user_agent` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "user_agent" TEXT NOT NULL;
