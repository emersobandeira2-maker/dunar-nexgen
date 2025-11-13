import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET - Listar todos os eventos
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação do admin
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.authenticated || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const events = await prisma.event.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        name: event.name,
        plate: event.vehicle.plate,
        price: event.price,
        eventDate: event.eventDate,
        description: event.description,
        isActive: event.isActive,
        user: event.vehicle.user,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }))
    });

  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar eventos' },
      { status: 500 }
    );
  }
}

// POST - Cadastrar novo evento
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação do admin
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.authenticated || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, plate, price, eventDate, description, userId } = body;

    // Validações
    if (!name || !plate || price === undefined || !userId) {
      return NextResponse.json(
        { error: 'Nome, placa, preço e usuário são obrigatórios' },
        { status: 400 }
      );
    }

    if (price < 0 || price > 1000) {
      return NextResponse.json(
        { error: 'Preço inválido' },
        { status: 400 }
      );
    }

    // Normalizar placa
    const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Verificar se a placa já existe
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate: normalizedPlate }
    });

    let vehicleId: string;

    if (existingVehicle) {
      // Verificar se já é evento
      const existingEvent = await prisma.event.findUnique({
        where: { vehicleId: existingVehicle.id }
      });

      if (existingEvent) {
        return NextResponse.json(
          { error: 'Esta placa já está cadastrada em um evento' },
          { status: 400 }
        );
      }

      vehicleId = existingVehicle.id;

      // Atualizar plateRole
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { plateRole: 'Evento' }
      });

    } else {
      // Criar novo veículo
      const newVehicle = await prisma.vehicle.create({
        data: {
          userId,
          plate: normalizedPlate,
          plateRole: 'Evento'
        }
      });
      vehicleId = newVehicle.id;
    }

    // Criar evento
    const event = await prisma.event.create({
      data: {
        name,
        vehicleId,
        price,
        eventDate: eventDate ? new Date(eventDate) : null,
        description: description || null,
        createdBy: adminAuth.admin.id
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
      message: 'Evento cadastrado com sucesso',
      event: {
        id: event.id,
        name: event.name,
        plate: event.vehicle.plate,
        price: event.price,
        eventDate: event.eventDate,
        description: event.description,
        user: event.vehicle.user
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar evento' },
      { status: 500 }
    );
  }
}
