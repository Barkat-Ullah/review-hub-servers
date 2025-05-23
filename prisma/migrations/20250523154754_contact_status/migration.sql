-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "status" "SupportStatus" NOT NULL DEFAULT 'PENDING';
