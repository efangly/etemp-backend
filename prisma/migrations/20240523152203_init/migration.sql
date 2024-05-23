/*
  Warnings:

  - You are about to drop the column `door` on the `Probes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Devices` ADD COLUMN `door` VARCHAR(11) NULL DEFAULT '1';

-- AlterTable
ALTER TABLE `Probes` DROP COLUMN `door`;
