import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar admin pelo email
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    // Por segurança, sempre retornar sucesso mesmo se o email não existir
    // Isso evita enumeração de usuários
    if (!admin) {
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
      })
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no banco
    await prisma.admin.update({
      where: { email },
      data: {
        twoFactorCode: resetToken,
        twoFactorExpiry: resetTokenExpiry,
      },
    })

    // TODO: Enviar email com link de recuperação
    // Por enquanto, apenas log no console
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/admin/redefinir-senha?token=${resetToken}`
    
    console.log('='.repeat(60))
    console.log('📧 EMAIL DE RECUPERAÇÃO DE SENHA - ADMIN')
    console.log('='.repeat(60))
    console.log(`Para: ${email}`)
    console.log(`Usuário: ${admin.username}`)
    console.log(`Link de recuperação: ${resetLink}`)
    console.log(`Token expira em: ${resetTokenExpiry.toLocaleString('pt-BR')}`)
    console.log('='.repeat(60))

    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
    })
  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
