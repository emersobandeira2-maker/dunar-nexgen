-- ========================================
-- MIGRATION INICIAL - MYSQL
-- Sistema: Dunar NexGen
-- Data: 11/11/2025
-- Banco: u252170951_complexo
-- ========================================

-- Criar tabela de Usuários (Clientes)
CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `documentType` VARCHAR(10) NULL,
    `document` VARCHAR(50) NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `resetToken` VARCHAR(255) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `lifetimePrize` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela de Administradores
CREATE TABLE IF NOT EXISTS `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'FUNCIONARIO',
    `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false,
    `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    `twoFactorMethod` VARCHAR(20) NULL,
    `twoFactorCode` VARCHAR(10) NULL,
    `twoFactorExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela de Veículos/Placas
CREATE TABLE IF NOT EXISTS `Vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `plate` VARCHAR(20) NOT NULL,
    `plateRole` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Vehicle_plate_key`(`plate`),
    INDEX `Vehicle_userId_idx`(`userId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela de Reservas
CREATE TABLE IF NOT EXISTS `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `passengers` INT NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Reservation_userId_idx`(`userId`),
    INDEX `Reservation_vehicleId_idx`(`vehicleId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela de Tickets (Pagamentos/Entradas)
CREATE TABLE IF NOT EXISTS `Ticket` (
    `id` VARCHAR(191) NOT NULL,
    `reservationId` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `passengers` INT NOT NULL,
    `useDate` DATETIME(3) NOT NULL,
    `paymentStatus` VARCHAR(50) NOT NULL DEFAULT 'Pendente',
    `ticketStatus` VARCHAR(50) NOT NULL DEFAULT 'Aguardando Liberação',
    `paymentMethod` VARCHAR(50) NULL,
    `paymentId` VARCHAR(255) NULL,
    `price` DOUBLE NULL,
    `isFree` BOOLEAN NOT NULL DEFAULT false,
    `releasedBy` VARCHAR(191) NULL,
    `releasedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Ticket_paymentStatus_idx`(`paymentStatus`),
    INDEX `Ticket_ticketStatus_idx`(`ticketStatus`),
    INDEX `Ticket_useDate_idx`(`useDate`),
    INDEX `Ticket_createdAt_idx`(`createdAt`),
    INDEX `Ticket_vehicleId_idx`(`vehicleId`),
    INDEX `Ticket_reservationId_idx`(`reservationId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ========================================
-- FIM DA MIGRATION
-- ========================================
