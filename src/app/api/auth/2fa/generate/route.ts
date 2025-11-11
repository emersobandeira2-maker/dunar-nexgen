import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Função para gerar código de 6 dígitos
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, method } = body;

    if (!adminId || !method) {
      return NextResponse.json(
        { error: "ID do administrador e método são obrigatórios" },
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

    if (!admin.twoFactorEnabled) {
      return NextResponse.json(
        { error: "2FA não está ativado para este usuário" },
        { status: 400 }
      );
    }

    // Gerar código
    const code = generateCode();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // Código válido por 10 minutos

    // Salvar código no banco
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorCode: code,
        twoFactorExpiry: expiry,
      },
    });

    // TODO: Enviar código por email ou SMS
    if (method === "email") {
      // Implementar envio de email
      console.log(`[2FA] Código para ${admin.email}: ${code}`);
    } else if (method === "sms") {
      // Implementar envio de SMS
      console.log(`[2FA] Código para ${admin.phone}: ${code}`);
    }

    return NextResponse.json({
      success: true,
      message: `Código enviado via ${method}`,
      // Em desenvolvimento, retornar o código (REMOVER EM PRODUÇÃO)
      code: process.env.NODE_ENV === "development" ? code : undefined,
    });
  } catch (error) {
    console.error("Erro ao gerar código 2FA:", error);
    return NextResponse.json(
      { error: "Erro ao gerar código 2FA" },
      { status: 500 }
    );
  }
}
