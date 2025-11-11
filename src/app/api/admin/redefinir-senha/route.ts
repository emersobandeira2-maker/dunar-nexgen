import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar admin pelo token
    const admin = await prisma.admin.findFirst({
      where: {
        twoFactorCode: token,
        twoFactorExpiry: {
          gte: new Date(), // Token não expirado
        },
      },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // Gerar hash da nova senha
    const passwordHash = await bcrypt.hash(password, 10)

    // Atualizar senha e limpar token
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        twoFactorCode: null,
        twoFactorExpiry: null,
      },
    })

    console.log(`✅ Senha redefinida com sucesso para o usuário: ${admin.username}`)

    return NextResponse.json({
      message: 'Senha redefinida com sucesso',
    })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
