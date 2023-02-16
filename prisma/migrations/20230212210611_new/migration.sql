/*
  Warnings:

  - You are about to drop the column `show` on the `Purchase` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Purchase` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - Added the required column `ticketId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Purchase` DROP COLUMN `show`,
    ADD COLUMN `ticketId` INTEGER NOT NULL,
    MODIFY `price` DECIMAL(65, 30) NOT NULL;
