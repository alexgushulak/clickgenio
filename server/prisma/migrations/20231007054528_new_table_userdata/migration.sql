-- CreateTable
CREATE TABLE "UserData" (
    "sessionId" SERIAL NOT NULL,
    "ipAddress" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "isCTAClicked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("sessionId")
);
