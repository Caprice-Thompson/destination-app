/*
  Warnings:

  - You are about to drop the column `createdAt` on the `world_heritage_site` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `world_heritage_site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "world_heritage_site" DROP COLUMN "createdAt",
DROP COLUMN "description";
