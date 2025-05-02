/*
  Warnings:

  - A unique constraint covering the columns `[userId,reviewId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `amount` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "premiumPrice" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT DEFAULT 'N/A',
ADD COLUMN     "city" TEXT DEFAULT 'N/A',
ADD COLUMN     "phone" TEXT DEFAULT 'N/A',
ADD COLUMN     "postcode" TEXT DEFAULT 'N/A',
ADD COLUMN     "state" TEXT DEFAULT 'N/A';

-- CreateIndex
CREATE UNIQUE INDEX "payments_userId_reviewId_key" ON "payments"("userId", "reviewId");
