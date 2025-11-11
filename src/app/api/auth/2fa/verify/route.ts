import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, code } = body;

    if (!adminId || !code) {
      return NextResponse.json(
        { error: "ID do administrador e código são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar administrador
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Administrador não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o código existe
    if (!admin.twoFactorCode || !admin.twoFactorExpiry) {
      return NextResponse.json(
        { error: "Nenhum código 2FA foi gerado" },
        { status: 400 }
      );
    }

    // Verificar se o código expirou
    if (new Date() > admin.twoFactorExpiry) {
      return NextResponse.json(
        { error: "Código expirado. Solicite um novo código." },
        { status: 400 }
      );
    }

    // Verificar se o código está correto
    if (admin.twoFactorCode !== code) {
      return NextResponse.json(
        { error: "Código inválido" },
        { status: 401 }
      );
    }

    // Limpar código após verificação bem-sucedida
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorCode: null,
        twoFactorExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao verificar código 2FA:", error);
    return NextResponse.json(
      { error: "Erro ao verificar código 2FA" },
      { status: 500 }
    );
  }
}
