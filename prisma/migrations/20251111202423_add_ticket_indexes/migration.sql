-- CreateIndex
CREATE INDEX "Ticket_paymentStatus_idx" ON "Ticket"("paymentStatus");

-- CreateIndex
CREATE INDEX "Ticket_ticketStatus_idx" ON "Ticket"("ticketStatus");

-- CreateIndex
CREATE INDEX "Ticket_useDate_idx" ON "Ticket"("useDate");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "Ticket_vehicleId_idx" ON "Ticket"("vehicleId");
