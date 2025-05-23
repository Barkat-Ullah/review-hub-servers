-- DropForeignKey
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_userId_fkey";

-- AlterTable
ALTER TABLE "testimonials" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
