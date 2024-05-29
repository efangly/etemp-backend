/*
  Warnings:

  - You are about to alter the column `ac` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `Char(10)` to `Char(1)`.
  - You are about to alter the column `door1` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `door2` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `door3` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `internet` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `sdCard` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `Char(10)` to `Char(1)`.
  - You are about to alter the column `ac` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `Char(10)` to `Char(1)`.
  - You are about to alter the column `door1` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `door2` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `door3` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `internet` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `sdCard` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `Char(10)` to `Char(1)`.

*/
-- AlterTable
ALTER TABLE `LogDays` MODIFY `ac` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `door1` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `door2` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `door3` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `internet` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `sdCard` CHAR(1) NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `LogDaysBackup` MODIFY `ac` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `door1` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `door2` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `door3` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `internet` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `sdCard` CHAR(1) NOT NULL DEFAULT '0';
