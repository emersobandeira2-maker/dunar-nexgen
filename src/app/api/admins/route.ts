import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        isSuperAdmin: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar administradores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, phone, password, role } = body;

    // Verificar se o usuário já existe
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Usuário ou email já cadastrado" },
        { status: 400 }
      );
    }

    // Criar hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar administrador
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        phone: phone || null,
        passwordHash,
        role: role || 'FUNCIONARIO',
        isSuperAdmin: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        isSuperAdmin: true,
        twoFactorEnabled: true,
        createdAt: true,
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    return NextResponse.json(
      { error: "Erro ao criar administrador" },
      { status: 500 }
    );
  }
}
