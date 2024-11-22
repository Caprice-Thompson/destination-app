/*
  Warnings:

  - Added the required column `description` to the `world_heritage_site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "world_heritage_site" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL;
