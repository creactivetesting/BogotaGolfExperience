-- AlterTable
ALTER TABLE "GolfCourse" ADD COLUMN "homeFeatured" BOOLEAN NOT NULL DEFAULT false;

-- Keep the current Home selection as the initial featured set.
UPDATE "GolfCourse"
SET "homeFeatured" = true
WHERE "name" IN (
  'Club La Cima',
  'Briceño 18',
  'Serrezuela Country Club',
  'San Andrés Golf Club',
  'Country Club de Bogotá',
  'Club Los Lagartos'
);
