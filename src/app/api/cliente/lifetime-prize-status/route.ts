import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getLifetimePrizeStatus } from '@/lib/lifetime-prize'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dunar-secret-key-cliente')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token-cliente')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar token
    const { payload } = await jwtVerify(token, secret)

    if (payload.type !== 'cliente') {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const userId = payload.userId as string

    // Buscar status do prêmio vitalício
    const status = await getLifetimePrizeStatus(userId)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Erro ao buscar status do prêmio vitalício:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar status do prêmio vitalício' },
      { status: 500 }
    )
  }
}
