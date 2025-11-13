import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET - Listar todos os cooperados
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

    const cooperatives = await prisma.cooperative.findMany({
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
      cooperatives: cooperatives.map(coop => ({
        id: coop.id,
        name: coop.name,
        plate: coop.vehicle.plate,
        price: coop.price,
        isActive: coop.isActive,
        user: coop.vehicle.user,
        createdAt: coop.createdAt,
        updatedAt: coop.updatedAt
      }))
    });

  } catch (error) {
    console.error('Erro ao listar cooperados:', error);
    return NextResponse.json(
      { error: 'Erro ao listar cooperados' },
      { status: 500 }
    );
  }
}

// POST - Cadastrar novo cooperado
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
    const { name, plate, price, userId } = body;

    // Validações
    if (!name || !plate || !userId) {
      return NextResponse.json(
        { error: 'Nome, placa e usuário são obrigatórios' },
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
      // Verificar se já é cooperado
      const existingCoop = await prisma.cooperative.findUnique({
        where: { vehicleId: existingVehicle.id }
      });

      if (existingCoop) {
        return NextResponse.json(
          { error: 'Esta placa já está cadastrada como cooperado' },
          { status: 400 }
        );
      }

      vehicleId = existingVehicle.id;

      // Atualizar plateRole
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { plateRole: 'Cooperado' }
      });

    } else {
      // Criar novo veículo
      const newVehicle = await prisma.vehicle.create({
        data: {
          userId,
          plate: normalizedPlate,
          plateRole: 'Cooperado'
        }
      });
      vehicleId = newVehicle.id;
    }

    // Buscar configuração para pegar preço padrão
    const config = await prisma.systemConfig.findFirst();
    const defaultPrice = config?.coopAccessPrice || 40.00;

    // Criar cooperado
    const cooperative = await prisma.cooperative.create({
      data: {
        name,
        vehicleId,
        price: price || defaultPrice,
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
      message: 'Cooperado cadastrado com sucesso',
      cooperative: {
        id: cooperative.id,
        name: cooperative.name,
        plate: cooperative.vehicle.plate,
        price: cooperative.price,
        user: cooperative.vehicle.user
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar cooperado:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar cooperado' },
      { status: 500 }
    );
  }
}
