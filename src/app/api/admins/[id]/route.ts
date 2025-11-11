import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { username, email, phone, password, twoFactorEnabled, twoFactorMethod } = body;

    // Preparar dados para atualização
    const updateData: any = {
      username,
      email,
      phone: phone || null,
      twoFactorEnabled: twoFactorEnabled || false,
      twoFactorMethod: twoFactorMethod || null,
      updatedAt: new Date(),
    };

    // Se uma nova senha foi fornecida, criar hash
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar administrador" },
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
    
    // Verificar se é o administrador principal (username = 'admin')
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { username: true },
    });

    if (admin?.username === 'admin') {
      return NextResponse.json(
        { error: "O administrador principal não pode ser excluído" },
        { status: 403 }
      );
    }
    
    // Verificar se não é o último administrador
    const adminCount = await prisma.admin.count();

    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Não é possível deletar o último administrador" },
        { status: 400 }
      );
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Administrador deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar administrador:", error);
    return NextResponse.json(
      { error: "Erro ao deletar administrador" },
      { status: 500 }
    );
  }
}
