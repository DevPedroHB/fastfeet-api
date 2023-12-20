/*
  Warnings:

  - You are about to drop the column `withdraw_at` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "withdraw_at",
ADD COLUMN     "withdrawn_at" TIMESTAMP(3);
