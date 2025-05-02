-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "reasonToUnpublish" TEXT;
