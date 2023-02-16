-- CreateTable
CREATE TABLE `User` (
    `cpf` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cpf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `ticket` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PurchaseToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PurchaseToUser_AB_unique`(`A`, `B`),
    INDEX `_PurchaseToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PurchaseToUser` ADD CONSTRAINT `_PurchaseToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PurchaseToUser` ADD CONSTRAINT `_PurchaseToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;
