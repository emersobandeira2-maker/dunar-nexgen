import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { ticketStatus, paymentStatus } = body;

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(ticketStatus && { ticketStatus }),
        ...(paymentStatus && { paymentStatus }),
        updatedAt: new Date(),
      },
      include: {
        vehicle: true,
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ticket" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ticket deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao deletar ticket" },
      { status: 500 }
    );
  }
}
