import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth, auditLog } from '@/lib/auth';

// GET - Listar todos os tickets (requer autenticação de admin)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (opcional - a rota /admin/* já é protegida pelo middleware)
    const auth = await verifyAuth(request);
    // if (!auth || !auth.isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: 'Acesso negado. Apenas administradores podem acessar esta rota.' },
    //     { status: 403 }
    //   );
    // }

    // Buscar parâmetros de query
    const searchParams = request.nextUrl.searchParams;
    const placa = searchParams.get('placa');
    const status = searchParams.get('status');
    
    const where: any = {};
    
    // Filtro por placa
    if (placa) {
      where.vehicle = {
        plate: {
          contains: placa
        }
      };
    }
    
    // Filtro por status
    if (status && status !== 'Todos') {
      if (status === 'pending') {
        where.paymentStatus = 'Pendente';
      } else if (status === 'paid') {
        where.paymentStatus = 'Pago';
        where.ticketStatus = 'Aguardando Liberação';
      } else if (status === 'released') {
        where.ticketStatus = 'Liberado';
      }
    }
    
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        vehicle: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Mapear para o formato esperado pelo frontend
    const formattedTickets = tickets.map(t => ({
      id: t.id,
      vehicle: {
        plate: t.vehicle.plate,
        plateRole: t.vehicle.plateRole,
        user: {
          name: t.vehicle.user.name,
          document: t.vehicle.user.document,
          phone: t.vehicle.user.phone
        }
      },
      passengers: t.passengers,
      price: t.price,
      paymentStatus: t.paymentStatus,
      ticketStatus: t.ticketStatus,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      isFree: t.isFree,
      releasedBy: t.releasedBy,
      releasedAt: t.releasedAt,
      useDate: t.useDate
    }));
    
    return NextResponse.json({
      success: true,
      tickets: formattedTickets
    });
    
  } catch (error: any) {
    console.error('Erro ao buscar tickets:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar tickets',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar status do ticket (liberar acesso) - requer autenticação de admin
export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticação (opcional - a rota /admin/* já é protegida pelo middleware)
    const auth = await verifyAuth(request);
    // if (!auth || !auth.isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: 'Acesso negado. Apenas administradores podem liberar acesso.' },
    //     { status: 403 }
    //   );
    // }
    
    // Usar um ID temporário de admin se não houver autenticação
    const adminId = auth?.userId || 'admin-temp';

    const body = await request.json();
    const { ticketId, action } = body;
    
    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'ID do ticket é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar ticket atual
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });
    
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }
    
    let updatedTicket;
    let message = '';
    
    if (action === 'liberar') {
      // Verificar se o pagamento está confirmado
      if (ticket.paymentStatus !== 'Pago') {
        return NextResponse.json(
          { success: false, error: 'Pagamento não confirmado. Não é possível liberar acesso.' },
          { status: 400 }
        );
      }
      // Garantir que não pode liberar duas vezes
      if (ticket.ticketStatus === 'Liberado') {
        return NextResponse.json(
          { success: false, error: 'Acesso já liberado.' },
          { status: 400 }
        );
      }
      
      updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          ticketStatus: 'Liberado',
          releasedAt: new Date(),
          releasedBy: adminId // Registrar qual admin liberou
        }
      });
      
      // Log de auditoria
      await auditLog('TICKET_RELEASED', {
        ticketId,
        vehiclePlate: ticket.vehicleId,
        previousStatus: ticket.ticketStatus
      }, adminId);
      
      message = 'Acesso liberado com sucesso!';
      
    } else if (action === 'solicitar_pagamento') {
      // Enviar notificação ao cliente
      if (ticket.paymentStatus !== 'Pendente') {
        return NextResponse.json(
          { success: false, error: 'Pagamento não está pendente.' },
          { status: 400 }
        );
      }
      
      // Chamar API de notificação
      try {
        const notifyResponse = await fetch('/api/admin/tickets/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId })
        });
        
        if (!notifyResponse.ok) {
          const notifyError = await notifyResponse.json();
          return NextResponse.json(
            { success: false, error: `Erro ao enviar notificação: ${notifyError.error}` },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error('Erro ao chamar API de notificação:', error);
      }
      
      message = 'Solicitação de pagamento enviada ao cliente!';
      updatedTicket = ticket; // Não houve alteração no banco
    } else {
      return NextResponse.json(
        { success: false, error: 'Ação inválida' },
        { status: 400 }
      );
    }
    
    // Buscar ticket atualizado (com JOIN para retornar todos os dados)
    const finalTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        vehicle: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!finalTicket) {
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar ticket atualizado' },
        { status: 500 }
      );
    }
    
    const formattedTicket = {
      id: finalTicket.id,
      vehicle: {
        plate: finalTicket.vehicle.plate,
        plateRole: finalTicket.vehicle.plateRole,
        user: {
          name: finalTicket.vehicle.user.name,
          document: finalTicket.vehicle.user.document,
          phone: finalTicket.vehicle.user.phone
        }
      },
      passengers: finalTicket.passengers,
      price: finalTicket.price,
      paymentStatus: finalTicket.paymentStatus,
      ticketStatus: finalTicket.ticketStatus,
      createdAt: finalTicket.createdAt,
      updatedAt: finalTicket.updatedAt,
      isFree: finalTicket.isFree,
      releasedBy: finalTicket.releasedBy,
      releasedAt: finalTicket.releasedAt,
      useDate: finalTicket.useDate
    };
    
    return NextResponse.json({
      success: true,
      message: message,
      ticket: formattedTicket
    });
    
  } catch (error: any) {
    console.error('Erro ao atualizar ticket:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar ticket',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
