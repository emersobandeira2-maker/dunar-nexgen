import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// PUT - Atualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação do admin
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.authenticated || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, price, eventDate, description, isActive } = body;

    // Verificar se evento existe
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Validar preço se fornecido
    if (price !== undefined && (price < 0 || price > 1000)) {
      return NextResponse.json(
        { error: 'Preço inválido' },
        { status: 400 }
      );
    }

    // Atualizar evento
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(eventDate !== undefined && { eventDate: eventDate ? new Date(eventDate) : null }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        vehicle: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Evento atualizado com sucesso',
      event: {
        id: updated.id,
        name: updated.name,
        plate: updated.vehicle.plate,
        price: updated.price,
        eventDate: updated.eventDate,
        description: updated.description,
        isActive: updated.isActive,
        user: updated.vehicle.user
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
      { status: 500 }
    );
  }
}

// DELETE - Remover evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação do admin
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.authenticated || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar se evento existe
    const event = await prisma.event.findUnique({
      where: { id },
      include: { vehicle: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar plateRole do veículo para Comum
    await prisma.vehicle.update({
      where: { id: event.vehicleId },
      data: { plateRole: 'Comum' }
    });

    // Deletar evento
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Evento removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover evento:', error);
    return NextResponse.json(
      { error: 'Erro ao remover evento' },
      { status: 500 }
    );
  }
}
