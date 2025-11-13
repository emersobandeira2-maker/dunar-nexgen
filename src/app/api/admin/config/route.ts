import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminToken } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET - Buscar configurações atuais
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

    // Buscar configuração (sempre há apenas 1 registro)
    let config = await prisma.systemConfig.findFirst();

    // Se não existir, criar com valores padrão
    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          normalAccessPrice: 50.00,
          coopAccessPrice: 40.00,
          updatedBy: adminAuth.admin.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      config: {
        normalAccessPrice: config.normalAccessPrice,
        coopAccessPrice: config.coopAccessPrice,
        updatedAt: config.updatedAt
      }
    });

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar configurações de preços
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticação do admin
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.authenticated || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Apenas SUPERADMIN pode alterar configurações
    if (!adminAuth.admin.isSuperAdmin && adminAuth.admin.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Apenas super administradores podem alterar configurações' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { normalAccessPrice, coopAccessPrice } = body;

    // Validações
    if (normalAccessPrice !== undefined && (normalAccessPrice < 0 || normalAccessPrice > 1000)) {
      return NextResponse.json(
        { error: 'Preço do acesso normal inválido' },
        { status: 400 }
      );
    }

    if (coopAccessPrice !== undefined && (coopAccessPrice < 0 || coopAccessPrice > 1000)) {
      return NextResponse.json(
        { error: 'Preço do cooperado inválido' },
        { status: 400 }
      );
    }

    // Buscar configuração existente
    let config = await prisma.systemConfig.findFirst();

    if (config) {
      // Atualizar existente
      config = await prisma.systemConfig.update({
        where: { id: config.id },
        data: {
          ...(normalAccessPrice !== undefined && { normalAccessPrice }),
          ...(coopAccessPrice !== undefined && { coopAccessPrice }),
          updatedBy: adminAuth.admin.id
        }
      });
    } else {
      // Criar novo
      config = await prisma.systemConfig.create({
        data: {
          normalAccessPrice: normalAccessPrice || 50.00,
          coopAccessPrice: coopAccessPrice || 40.00,
          updatedBy: adminAuth.admin.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      config: {
        normalAccessPrice: config.normalAccessPrice,
        coopAccessPrice: config.coopAccessPrice,
        updatedAt: config.updatedAt
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    );
  }
}
