-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT,
    "vehicleId" TEXT NOT NULL,
    "passengers" INTEGER NOT NULL,
    "useDate" DATETIME NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pendente',
    "ticketStatus" TEXT NOT NULL DEFAULT 'Aguardando Liberação',
    "paymentMethod" TEXT,
    "paymentId" TEXT,
    "price" REAL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ticket_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("createdAt", "id", "passengers", "paymentId", "paymentMethod", "paymentStatus", "reservationId", "ticketStatus", "updatedAt", "useDate", "vehicleId") SELECT "createdAt", "id", "passengers", "paymentId", "paymentMethod", "paymentStatus", "reservationId", "ticketStatus", "updatedAt", "useDate", "vehicleId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "documentType" TEXT,
    "document" TEXT,
    "passwordHash" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME,
    "lifetimePrize" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "document", "documentType", "email", "id", "name", "passwordHash", "phone", "resetToken", "resetTokenExpiry", "updatedAt") SELECT "createdAt", "document", "documentType", "email", "id", "name", "passwordHash", "phone", "resetToken", "resetTokenExpiry", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
