/*
  Warnings:

  - You are about to drop the column `profileUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "transactionStatus" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "premiumPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profileUrl",
DROP COLUMN "status";
