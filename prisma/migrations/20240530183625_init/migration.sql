/*
  Warnings:

  - You are about to alter the column `ssid` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - You are about to alter the column `ssidPass` on the `Configs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - You are about to alter the column `devSeq` on the `Devices` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `duration` on the `Devices` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `battery` on the `LogDays` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `battery` on the `LogDaysBackup` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `door` on the `Probes` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `repairNo` on the `Repairs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - Made the column `mobileNoti` on table `Configs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `repeat` on table `Configs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Configs` MODIFY `ssid` VARCHAR(100) NULL,
    MODIFY `ssidPass` VARCHAR(100) NULL,
    MODIFY `notiTime` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `mobileNoti` CHAR(1) NOT NULL DEFAULT '1',
    MODIFY `repeat` CHAR(1) NOT NULL DEFAULT '1';

-- AlterTable
ALTER TABLE `Devices` MODIFY `devSeq` SMALLINT NOT NULL,
    MODIFY `duration` SMALLINT NULL;

-- AlterTable
ALTER TABLE `LogDays` MODIFY `tempValue` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `tempAvg` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `humidityValue` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `humidityAvg` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `battery` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `ambient` FLOAT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `LogDaysBackup` MODIFY `tempValue` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `tempAvg` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `humidityValue` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `humidityAvg` FLOAT NOT NULL DEFAULT 0.00,
    MODIFY `battery` SMALLINT NOT NULL DEFAULT 0,
    MODIFY `ambient` FLOAT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `Probes` MODIFY `door` SMALLINT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Repairs` MODIFY `repairNo` SMALLINT NOT NULL AUTO_INCREMENT;
