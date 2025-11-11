import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Webhook recebido do Mercado Pago:", body);

    // Mercado Pago envia notificações de diferentes tipos
    if (body.type === "payment") {
      const paymentId = body.data?.id;
      
      if (!paymentId) {
        return NextResponse.json({ received: true });
      }

      // Aqui você pode buscar os detalhes do pagamento na API do Mercado Pago
      // e atualizar o status do ticket/reserva no banco de dados
      
      // Exemplo de como atualizar um ticket baseado no external_reference
      const externalReference = body.external_reference;
      
      if (externalReference && externalReference.startsWith("ticket-")) {
        const ticketId = externalReference.replace("ticket-", "");
        
        await prisma.ticket.update({
          where: { id: ticketId },
          data: {
            paymentStatus: "Pago",
            paymentId: paymentId.toString(),
            paymentMethod: "mercadopago",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// Mercado Pago também envia GET para validar a URL
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
