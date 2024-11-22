/*
  Warnings:

  - You are about to drop the `LargestCity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThingToDo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorldHeritageSite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LargestCity";

-- DropTable
DROP TABLE "ThingToDo";

-- DropTable
DROP TABLE "WorldHeritageSite";

-- CreateTable
CREATE TABLE "world_heritage_site" (
    "id" SERIAL NOT NULL,
    "site" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "world_heritage_site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "things_to_do" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "item" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "things_to_do_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "population" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "population" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "population_pkey" PRIMARY KEY ("id")
);
