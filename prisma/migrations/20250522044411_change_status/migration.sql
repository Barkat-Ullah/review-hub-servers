/*
  Warnings:

  - The values [DRAFT] on the enum `Review_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Review_Status_new" AS ENUM ('PENDING', 'PUBLISHED', 'UNPUBLISHED');
ALTER TABLE "reviews" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reviews" ALTER COLUMN "status" TYPE "Review_Status_new" USING ("status"::text::"Review_Status_new");
ALTER TYPE "Review_Status" RENAME TO "Review_Status_old";
ALTER TYPE "Review_Status_new" RENAME TO "Review_Status";
DROP TYPE "Review_Status_old";
ALTER TABLE "reviews" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "status" SET DEFAULT 'PENDING';
