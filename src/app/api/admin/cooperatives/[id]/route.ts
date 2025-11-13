import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// PUT - Atualizar cooperado
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
    const { name, price, isActive } = body;

    // Verificar se cooperado existe
    const cooperative = await prisma.cooperative.findUnique({
      where: { id }
    });

    if (!cooperative) {
      return NextResponse.json(
        { error: 'Cooperado não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar cooperado
    const updated = await prisma.cooperative.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
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
      message: 'Cooperado atualizado com sucesso',
      cooperative: {
        id: updated.id,
        name: updated.name,
        plate: updated.vehicle.plate,
        price: updated.price,
        isActive: updated.isActive,
        user: updated.vehicle.user
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar cooperado:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cooperado' },
      { status: 500 }
    );
  }
}

// DELETE - Remover cooperado
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

    // Verificar se cooperado existe
    const cooperative = await prisma.cooperative.findUnique({
      where: { id },
      include: { vehicle: true }
    });

    if (!cooperative) {
      return NextResponse.json(
        { error: 'Cooperado não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar plateRole do veículo para Comum
    await prisma.vehicle.update({
      where: { id: cooperative.vehicleId },
      data: { plateRole: 'Comum' }
    });

    // Deletar cooperado
    await prisma.cooperative.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Cooperado removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover cooperado:', error);
    return NextResponse.json(
      { error: 'Erro ao remover cooperado' },
      { status: 500 }
    );
  }
}
