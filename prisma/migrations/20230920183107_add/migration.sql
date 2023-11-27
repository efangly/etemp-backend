/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Notification`;

-- CreateTable
CREATE TABLE `Noti` (
    `NotiId` VARCHAR(191) NOT NULL,
    `NotiName` VARCHAR(191) NOT NULL,
    `NotiLocate` VARCHAR(191) NOT NULL,
    `NotiStatus` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`NotiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotiDetail` (
    `DetailId` VARCHAR(191) NOT NULL,
    `NotiId` VARCHAR(191) NOT NULL,
    `DetailTitle` VARCHAR(191) NOT NULL,
    `DetailName` VARCHAR(191) NOT NULL,
    `DetailStatus` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`DetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
