import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where = userId ? { userId } : {};

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar reservas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plate, passengers, startDate, endDate, plateRole } = body;

    // Verificar se o veículo já existe, se não, criar
    let vehicle = await prisma.vehicle.findUnique({
      where: { plate },
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          plate,
          plateRole: plateRole || "Comum",
          userId,
        },
      });
    }

    // Criar a reserva
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        vehicleId: vehicle.id,
        passengers: parseInt(passengers),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "pending",
      },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao criar reserva" },
      { status: 500 }
    );
  }
}
