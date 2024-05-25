-- CreateTable
CREATE TABLE `Devices` (
    `devId` VARCHAR(100) NOT NULL,
    `wardId` VARCHAR(100) NOT NULL,
    `devSerial` VARCHAR(100) NOT NULL,
    `devName` VARCHAR(500) NOT NULL,
    `devDetail` VARCHAR(500) NULL,
    `devStatus` BOOLEAN NOT NULL DEFAULT false,
    `devSeq` INTEGER NOT NULL,
    `devZone` VARCHAR(155) NULL,
    `installLocation` VARCHAR(250) NULL,
    `locationPic` VARCHAR(200) NULL,
    `installDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `firmwareVersion` VARCHAR(55) NULL,
    `invoice` VARCHAR(50) NULL,
    `createBy` VARCHAR(100) NULL,
    `comment` VARCHAR(155) NULL,
    `backupStatus` CHAR(1) NULL DEFAULT '0',
    `moveStatus` VARCHAR(100) NULL,
    `alarn` BOOLEAN NOT NULL DEFAULT false,
    `duration` INTEGER NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Devices_devSerial_key`(`devSerial`),
    UNIQUE INDEX `Devices_devName_key`(`devName`),
    UNIQUE INDEX `Devices_devSeq_key`(`devSeq`),
    PRIMARY KEY (`devId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Probes` (
    `probeId` VARCHAR(100) NOT NULL,
    `probeName` VARCHAR(255) NOT NULL,
    `probeType` VARCHAR(20) NOT NULL,
    `probeCh` CHAR(1) NOT NULL,
    `tempMin` FLOAT NOT NULL DEFAULT 0.00,
    `tempMax` FLOAT NOT NULL DEFAULT 0.00,
    `humMin` FLOAT NOT NULL DEFAULT 0.00,
    `humMax` FLOAT NOT NULL DEFAULT 0.00,
    `adjustTemp` FLOAT NOT NULL DEFAULT 0.00,
    `adjustHum` FLOAT NOT NULL DEFAULT 0.00,
    `delayTime` VARCHAR(11) NULL,
    `door` INTEGER NULL DEFAULT 0,
    `devId` VARCHAR(100) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`probeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configs` (
    `confId` VARCHAR(100) NOT NULL,
    `ip` VARCHAR(50) NULL,
    `macAddEth` VARCHAR(50) NULL,
    `macAddWiFi` VARCHAR(50) NULL,
    `subNet` VARCHAR(50) NULL,
    `getway` VARCHAR(50) NULL,
    `dns` VARCHAR(50) NULL,
    `ssid` VARCHAR(200) NULL,
    `ssidPass` VARCHAR(200) NULL,
    `sim` VARCHAR(100) NULL,
    `email1` VARCHAR(100) NULL,
    `email2` VARCHAR(100) NULL,
    `email3` VARCHAR(100) NULL,
    `notiTime` INTEGER NOT NULL DEFAULT 0,
    `backToNormal` BOOLEAN NOT NULL DEFAULT false,
    `mobileNoti` BOOLEAN NOT NULL DEFAULT true,
    `repeat` INTEGER NOT NULL DEFAULT 1,
    `devId` VARCHAR(100) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Configs_devId_key`(`devId`),
    PRIMARY KEY (`confId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hospitals` (
    `hosId` VARCHAR(100) NOT NULL,
    `hosName` VARCHAR(155) NOT NULL,
    `hosAddress` VARCHAR(155) NULL,
    `hosTelephone` VARCHAR(100) NULL,
    `userContact` VARCHAR(155) NULL,
    `userTelePhone` VARCHAR(100) NULL,
    `hosLatitude` VARCHAR(155) NULL,
    `hosLongitude` VARCHAR(155) NULL,
    `hosPic` VARCHAR(255) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`hosId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wards` (
    `wardId` VARCHAR(100) NOT NULL,
    `wardName` VARCHAR(250) NOT NULL,
    `wardSeq` INTEGER NOT NULL,
    `hosId` VARCHAR(100) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Wards_wardSeq_key`(`wardSeq`),
    PRIMARY KEY (`wardId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `userId` VARCHAR(100) NOT NULL,
    `wardId` VARCHAR(100) NOT NULL,
    `userName` VARCHAR(155) NOT NULL,
    `userPassword` VARCHAR(155) NOT NULL,
    `userStatus` BOOLEAN NOT NULL DEFAULT true,
    `userLevel` CHAR(1) NOT NULL DEFAULT '4',
    `displayName` VARCHAR(150) NULL,
    `userPic` VARCHAR(255) NULL,
    `comment` VARCHAR(255) NULL,
    `createBy` VARCHAR(155) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_userName_key`(`userName`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `roleId` CHAR(1) NOT NULL,
    `roleName` VARCHAR(500) NOT NULL,
    `rolePriority` CHAR(1) NOT NULL DEFAULT '4',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `notiId` VARCHAR(100) NOT NULL,
    `devId` VARCHAR(100) NOT NULL,
    `notiDetail` VARCHAR(255) NOT NULL,
    `notiStatus` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repairs` (
    `repairId` VARCHAR(100) NOT NULL,
    `devId` VARCHAR(100) NOT NULL,
    `repairInfo` VARCHAR(155) NULL,
    `repairLocation` VARCHAR(155) NULL,
    `ward` VARCHAR(155) NULL,
    `repairDetails` VARCHAR(155) NULL,
    `telePhone` VARCHAR(11) NULL,
    `repairStatus` VARCHAR(155) NULL,
    `warrantyStatus` CHAR(1) NULL,
    `comment` VARCHAR(155) NULL,
    `baseStatus` CHAR(1) NULL DEFAULT '0',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`repairId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warranties` (
    `warrId` VARCHAR(100) NOT NULL,
    `devName` VARCHAR(100) NOT NULL,
    `expire` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `warrStatus` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`warrId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogDays` (
    `logId` VARCHAR(100) NOT NULL,
    `devId` VARCHAR(100) NOT NULL,
    `tempValue` DOUBLE NOT NULL DEFAULT 0.00,
    `tempAvg` DOUBLE NOT NULL DEFAULT 0.00,
    `humidityValue` DOUBLE NOT NULL DEFAULT 0.00,
    `humidityAvg` DOUBLE NOT NULL DEFAULT 0.00,
    `sendTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ac` CHAR(10) NOT NULL DEFAULT '0',
    `door1` BOOLEAN NOT NULL DEFAULT false,
    `door2` BOOLEAN NOT NULL DEFAULT false,
    `door3` BOOLEAN NOT NULL DEFAULT false,
    `internet` BOOLEAN NOT NULL DEFAULT false,
    `probe` VARCHAR(10) NOT NULL DEFAULT '1',
    `battery` INTEGER NOT NULL DEFAULT 0,
    `ambient` DOUBLE NULL DEFAULT 0.00,
    `sdCard` CHAR(10) NOT NULL DEFAULT '0',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogDaysBackup` (
    `logId` VARCHAR(100) NOT NULL,
    `devId` VARCHAR(100) NOT NULL,
    `tempValue` DOUBLE NOT NULL DEFAULT 0.00,
    `tempAvg` DOUBLE NOT NULL DEFAULT 0.00,
    `humidityValue` DOUBLE NOT NULL DEFAULT 0.00,
    `humidityAvg` DOUBLE NOT NULL DEFAULT 0.00,
    `sendTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ac` CHAR(10) NOT NULL DEFAULT '0',
    `door1` BOOLEAN NOT NULL DEFAULT false,
    `door2` BOOLEAN NOT NULL DEFAULT false,
    `door3` BOOLEAN NOT NULL DEFAULT false,
    `internet` BOOLEAN NOT NULL DEFAULT false,
    `probe` VARCHAR(10) NOT NULL DEFAULT '1',
    `battery` INTEGER NOT NULL DEFAULT 0,
    `ambient` DOUBLE NULL DEFAULT 0.00,
    `sdCard` CHAR(10) NOT NULL DEFAULT '0',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `Wards`(`wardId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Probes` ADD CONSTRAINT `Probes_devId_fkey` FOREIGN KEY (`devId`) REFERENCES `Devices`(`devId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Configs` ADD CONSTRAINT `Configs_devId_fkey` FOREIGN KEY (`devId`) REFERENCES `Devices`(`devId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wards` ADD CONSTRAINT `Wards_hosId_fkey` FOREIGN KEY (`hosId`) REFERENCES `Hospitals`(`hosId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `Wards`(`wardId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_userLevel_fkey` FOREIGN KEY (`userLevel`) REFERENCES `Roles`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_devId_fkey` FOREIGN KEY (`devId`) REFERENCES `Devices`(`devId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repairs` ADD CONSTRAINT `Repairs_devId_fkey` FOREIGN KEY (`devId`) REFERENCES `Devices`(`devId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Warranties` ADD CONSTRAINT `Warranties_devName_fkey` FOREIGN KEY (`devName`) REFERENCES `Devices`(`devName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogDays` ADD CONSTRAINT `LogDays_devId_fkey` FOREIGN KEY (`devId`) REFERENCES `Devices`(`devId`) ON DELETE RESTRICT ON UPDATE CASCADE;