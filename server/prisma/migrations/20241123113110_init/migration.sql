-- CreateTable
CREATE TABLE "LogEvent" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "service" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,

    CONSTRAINT "LogEvent_pkey" PRIMARY KEY ("id")
);
