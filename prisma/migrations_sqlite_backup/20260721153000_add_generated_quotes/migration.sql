-- CreateTable
CREATE TABLE "GeneratedQuote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "packageSubtitle" TEXT,
    "packageDuration" TEXT,
    "playerCount" INTEGER NOT NULL,
    "ambassadorName" TEXT,
    "ambassadorCode" TEXT,
    "subtotal" REAL NOT NULL,
    "commission" REAL NOT NULL,
    "netMargin" REAL NOT NULL,
    "selectedCoursesJson" TEXT NOT NULL,
    "includedItemsJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
