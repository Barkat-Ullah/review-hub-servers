/*
  Warnings:

  - You are about to drop the column `value` on the `votes` table. All the data in the column will be lost.
  - Added the required column `vote` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE', 'NONE');

-- AlterTable
ALTER TABLE "votes" DROP COLUMN "value",
ADD COLUMN     "vote" "VoteType" NOT NULL;
