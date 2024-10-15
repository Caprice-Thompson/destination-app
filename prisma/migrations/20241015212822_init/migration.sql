-- CreateTable
CREATE TABLE "WorldHeritageSite" (
    "id" SERIAL NOT NULL,
    "site" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorldHeritageSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThingToDo" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "item" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThingToDo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LargestCity" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "population" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LargestCity_pkey" PRIMARY KEY ("id")
);
