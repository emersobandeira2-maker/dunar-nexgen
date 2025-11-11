import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/db'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dunar-secret-key')

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar token
    const { payload } = await jwtVerify(token, secret)

    if (payload.type !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const adminId = payload.userId as string
    const { ticketId } = await request.json()

    if (!ticketId) {
      return NextResponse.json(
        { error: 'ID do ticket não fornecido' },
        { status: 400 }
      )
    }

    // Buscar ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já foi liberado
    if (ticket.ticketStatus === 'Liberado') {
      return NextResponse.json(
        { error: 'Este ticket já foi liberado anteriormente' },
        { status: 400 }
      )
    }

    // Verificar se o pagamento foi confirmado
    if (ticket.paymentStatus !== 'Pago' && !ticket.isFree) {
      return NextResponse.json(
        { error: 'Pagamento ainda não foi confirmado' },
        { status: 400 }
      )
    }

    // Liberar acesso
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ticketStatus: 'Liberado',
        releasedBy: adminId,
        releasedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      ticket: updatedTicket
    })
  } catch (error) {
    console.error('Erro ao liberar acesso:', error)
    return NextResponse.json(
      { error: 'Erro ao liberar acesso' },
      { status: 500 }
    )
  }
}
