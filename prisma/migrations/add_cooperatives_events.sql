-- Migration: Add Cooperatives, Events and SystemConfig tables
-- Date: 2025-11-12

-- Criar tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS `SystemConfig` (
    `id` VARCHAR(191) NOT NULL,
    `normalAccessPrice` DOUBLE NOT NULL DEFAULT 50.00,
    `coopAccessPrice` DOUBLE NOT NULL DEFAULT 40.00,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela de Cooperados
CREATE TABLE IF NOT EXISTS `Cooperative` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 40.00,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Cooperative_vehicleId_key`(`vehicleId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela de Eventos
CREATE TABLE IF NOT EXISTS `Event` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `eventDate` DATETIME(3) NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Event_vehicleId_key`(`vehicleId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Adicionar campo ticketType na tabela Ticket
ALTER TABLE `Ticket` ADD COLUMN IF NOT EXISTS `ticketType` VARCHAR(50) NOT NULL DEFAULT 'Normal';

-- Criar índice para ticketType
CREATE INDEX IF NOT EXISTS `Ticket_ticketType_idx` ON `Ticket`(`ticketType`);

-- Inserir configuração padrão
INSERT INTO `SystemConfig` (`id`, `normalAccessPrice`, `coopAccessPrice`, `createdAt`, `updatedAt`)
SELECT 'default-config', 50.00, 40.00, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM `SystemConfig` LIMIT 1);
