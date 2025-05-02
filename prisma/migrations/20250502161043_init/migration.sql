-- CreateEnum
CREATE TYPE "User_Status" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "status" "User_Status" NOT NULL DEFAULT 'ACTIVE';
