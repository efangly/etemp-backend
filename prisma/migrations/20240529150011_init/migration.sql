/*
  Warnings:

  - You are about to alter the column `mode` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Char(1)`.
  - You are about to alter the column `backToNormal` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.
  - You are about to alter the column `mobileNoti` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Char(1)`.

*/
-- AlterTable
ALTER TABLE `Configs` MODIFY `mode` CHAR(1) NULL DEFAULT '0',
    MODIFY `backToNormal` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `mobileNoti` CHAR(1) NULL DEFAULT '1',
    MODIFY `repeat` CHAR(1) NULL DEFAULT '1';
