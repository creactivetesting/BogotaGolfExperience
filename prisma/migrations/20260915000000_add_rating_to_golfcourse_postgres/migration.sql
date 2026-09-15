-- Add the missing GolfCourse rating column so the production DB matches the Prisma schema.
ALTER TABLE "GolfCourse"
ADD COLUMN "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.8;
