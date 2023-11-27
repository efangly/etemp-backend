-- CreateTable
CREATE TABLE `User` (
    `UserId` VARCHAR(191) NOT NULL,
    `UserName` VARCHAR(191) NOT NULL,
    `PassWord` VARCHAR(191) NOT NULL,
    `UserStatus` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`UserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
