-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "status" "User_Status" NOT NULL DEFAULT 'ACTIVE';
