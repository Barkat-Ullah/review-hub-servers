-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "bank_status" TEXT,
ADD COLUMN     "date_time" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "sp_code" TEXT,
ADD COLUMN     "sp_message" TEXT,
ALTER COLUMN "transactionId" DROP NOT NULL;
