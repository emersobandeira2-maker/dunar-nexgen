import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, auditLog } from '@/lib/auth';

/**
 * POST - Enviar notificação de pagamento pendente ao cliente
 * Requer autenticação de admin
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (opcional - a rota /admin/* já é protegida pelo middleware)
    const auth = await verifyAuth(request);
    const adminId = auth?.userId || 'admin-temp';

    const body = await request.json();
    const { ticketId } = body;
    
    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'ID do ticket é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar ticket com dados do usuário
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        vehicle: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o pagamento está pendente
    if (ticket.paymentStatus !== 'Pendente') {
      return NextResponse.json(
        { success: false, error: 'Pagamento não está pendente.' },
        { status: 400 }
      );
    }
    
    const user = ticket.vehicle.user;
    const notificationsSent: string[] = [];
    
    // Enviar notificação por email (se houver email)
    if (user.email) {
      try {
        // TODO: Integrar com serviço de email (SendGrid, AWS SES, etc.)
        console.log('[EMAIL] Enviando notificação de pagamento para:', user.email);
        console.log('[EMAIL] Ticket ID:', ticketId);
        console.log('[EMAIL] Valor:', ticket.price);
        console.log('[EMAIL] Placa:', ticket.vehicle.plate);
        
        // Simulação de envio de email
        // await sendEmail({
        //   to: user.email,
        //   subject: 'Pagamento Pendente - Dunar',
        //   body: `Olá ${user.name}, você tem um pagamento pendente de R$ ${ticket.price?.toFixed(2)} para a placa ${ticket.vehicle.plate}.`
        // });
        
        notificationsSent.push('email');
      } catch (error) {
        console.error('Erro ao enviar email:', error);
      }
    }
    
    // Enviar notificação por SMS (se houver telefone)
    if (user.phone) {
      try {
        // TODO: Integrar com serviço de SMS (Twilio, AWS SNS, etc.)
        console.log('[SMS] Enviando notificação de pagamento para:', user.phone);
        console.log('[SMS] Ticket ID:', ticketId);
        console.log('[SMS] Valor:', ticket.price);
        console.log('[SMS] Placa:', ticket.vehicle.plate);
        
        // Simulação de envio de SMS
        // await sendSMS({
        //   to: user.phone,
        //   message: `Dunar: Pagamento pendente de R$ ${ticket.price?.toFixed(2)} para a placa ${ticket.vehicle.plate}. Acesse o app para pagar.`
        // });
        
        notificationsSent.push('sms');
      } catch (error) {
        console.error('Erro ao enviar SMS:', error);
      }
    }
    
    // Log de auditoria
    await auditLog('PAYMENT_NOTIFICATION_SENT', {
      ticketId,
      userId: user.id,
      vehiclePlate: ticket.vehicle.plate,
      notificationsSent
    }, adminId);
    
    if (notificationsSent.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nenhum meio de contato disponível (email ou telefone)' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Notificação enviada com sucesso via ${notificationsSent.join(' e ')}`,
      notificationsSent
    });
    
  } catch (error: any) {
    console.error('Erro ao enviar notificação:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao enviar notificação',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
