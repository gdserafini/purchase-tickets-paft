/*
  Warnings:

  - You are about to drop the column `ticket` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PurchaseToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `show` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_PurchaseToUser` DROP FOREIGN KEY `_PurchaseToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PurchaseToUser` DROP FOREIGN KEY `_PurchaseToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Purchase` DROP COLUMN `ticket`,
    ADD COLUMN `show` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `_PurchaseToUser`;
