import { NextRequest, NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, quantity, unit_price, reservationId, userId, plate, visitDate, type } = body;

    if (!title || !quantity || !unit_price) {
      return NextResponse.json(
        { error: "Dados incompletos para criar pagamento" },
        { status: 400 }
      );
    }
    
    // Validar tipo de acesso
    if (type && !['reservation', 'walk-in'].includes(type)) {
      return NextResponse.json(
        { error: "Tipo de acesso inválido" },
        { status: 400 }
      );
    }

    // Criar preferência de pagamento
    const preferenceData = {
      items: [
        {
          id: `ticket-${Date.now()}`,
          title: title,
          quantity: parseInt(quantity),
          unit_price: parseFloat(unit_price),
          currency_id: "BRL",
        },
      ],
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/cliente/resultado-pagamento?status=success`,
        failure: `${process.env.NEXTAUTH_URL}/cliente/resultado-pagamento?status=failure`,
        pending: `${process.env.NEXTAUTH_URL}/cliente/resultado-pagamento?status=pending`,
      },
      auto_return: "approved" as const,
      external_reference: reservationId || `${type || 'ticket'}-${Date.now()}`,
      notification_url: `${process.env.NEXTAUTH_URL}/api/payment/webhook`,
      statement_descriptor: "DUNAR NEXGEN",
      metadata: {
        reservation_id: reservationId,
        user_id: userId,
        plate: plate,
        visit_date: visitDate,
        access_type: type || 'reservation', // 'reservation' ou 'walk-in'
      },
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error: any) {
    console.error("Erro ao criar preferência de pagamento:", error);
    return NextResponse.json(
      { 
        error: "Erro ao criar preferência de pagamento",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
