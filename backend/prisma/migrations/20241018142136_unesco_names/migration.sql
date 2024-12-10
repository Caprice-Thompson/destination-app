/*
  Warnings:

  - You are about to drop the column `location` on the `world_heritage_site` table. All the data in the column will be lost.
  - Added the required column `area` to the `world_heritage_site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `world_heritage_site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "world_heritage_site" DROP COLUMN "location",
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL;
