import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        vehicle: true,
        reservation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plate, passengers, useDate, plateRole, paymentStatus } = body;

    // Verificar se o veículo já existe, se não, criar
    let vehicle = await prisma.vehicle.findUnique({
      where: { plate },
    });

    if (!vehicle) {
      // Criar um usuário temporário para o veículo (reserva avulsa)
      const tempUser = await prisma.user.findFirst({
        where: { email: "temp@dunar.com" },
      });

      let userId = tempUser?.id;

      if (!tempUser) {
        const newTempUser = await prisma.user.create({
          data: {
            name: "Usuário Temporário",
            email: "temp@dunar.com",
            passwordHash: "temp",
          },
        });
        userId = newTempUser.id;
      }

      vehicle = await prisma.vehicle.create({
        data: {
          plate,
          plateRole: plateRole || "Comum",
          userId: userId!,
        },
      });
    }

    // Criar o ticket
    const ticket = await prisma.ticket.create({
      data: {
        vehicleId: vehicle.id,
        passengers: parseInt(passengers),
        useDate: new Date(useDate),
        paymentStatus: paymentStatus || "Pendente",
        ticketStatus: "Aguardando Liberação",
      },
      include: {
        vehicle: true,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao criar ticket" },
      { status: 500 }
    );
  }
}
