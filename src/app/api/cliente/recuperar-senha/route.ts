import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Por segurança, sempre retornar sucesso mesmo se o email não existir
    // Isso evita que atacantes descubram quais emails estão cadastrados
    if (!user) {
      return NextResponse.json({
        message: "Se o email estiver cadastrado, você receberá um link de recuperação",
      })
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // URL de redefinição de senha
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cliente/redefinir-senha?token=${resetToken}`

    // TODO: Enviar email com o link de recuperação
    // Por enquanto, apenas logamos no console
    console.log("=".repeat(80))
    console.log("LINK DE RECUPERAÇÃO DE SENHA")
    console.log("=".repeat(80))
    console.log(`Email: ${email}`)
    console.log(`Link: ${resetUrl}`)
    console.log(`Token válido por: 1 hora`)
    console.log("=".repeat(80))

    // Em produção, você deve configurar um serviço de email como:
    // - Nodemailer com SMTP
    // - SendGrid
    // - AWS SES
    // - Resend
    //
    // Exemplo com Nodemailer:
    /*
    const nodemailer = require("nodemailer")
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Recuperação de Senha - Dunar NexGen",
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      `,
    })
    */

    return NextResponse.json({
      message: "Se o email estiver cadastrado, você receberá um link de recuperação",
    })
  } catch (error) {
    console.error("Erro ao processar recuperação de senha:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    )
  }
}
