-- Add missing columns to GolfCourse table so Prisma and admin UI match the live database schema.
ALTER TABLE "GolfCourse"
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
