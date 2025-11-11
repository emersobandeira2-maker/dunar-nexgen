import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dunar-secret-key-cliente");

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token-cliente")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Verificar token
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Buscar reservas do usuário
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        vehicle: true,
        tickets: true,
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
