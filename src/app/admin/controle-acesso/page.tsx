'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import NavigationButtons from '@/components/ui/navigation-buttons'
import { useToast } from '@/components/ui/toast'

interface Ticket {
  id: string
  vehicle: {
    plate: string
    plateRole: string
    user: {
      name: string
      phone: string | null
    }
  }
  passengers: number
  useDate: string
  paymentStatus: string
  ticketStatus: string
  price: number | null
  isFree: boolean
  releasedBy: string | null
  releasedAt: string | null
  createdAt: string
}

export default function ControleAcessoPage() {
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])

  const [searchPlate, setSearchPlate] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'released'>('all')
  const [loading, setLoading] = useState(true)
  const [releasing, setReleasing] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (searchPlate) query.append('placa', searchPlate);
      if (filterStatus !== 'all') query.append('status', filterStatus);

      const response = await fetch('/api/admin/tickets?' + query.toString())
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      } else {
        console.error('Erro na resposta da API:', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error)
    } finally {
      setLoading(false)
    }
  }, [searchPlate, filterStatus])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])


  const handleRelease = async (ticketId: string, action: 'liberar' | 'solicitar_pagamento' = 'liberar') => {
    const confirmMessage = action === 'liberar' 
      ? 'Confirma a liberação de acesso deste veículo?' 
      : 'Confirma o envio da solicitação de pagamento ao cliente?';
    
    if (!confirm(confirmMessage)) return

    setReleasing(ticketId)
    try {
    const response = await fetch('/api/admin/tickets', {   method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, action })
      })

      if (response.ok) {
        const message = action === 'liberar' 
          ? 'Acesso liberado com sucesso!' 
          : 'Solicitação de pagamento enviada com sucesso!';
        showToast(message, 'success');
        fetchTickets()
      } else {
        const error = await response.json()
        showToast(`Erro: ${error.error}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao liberar acesso:', error)
      showToast('Erro ao liberar acesso', 'error');
    } finally {
      setReleasing(null)
    }
  }

  const getStatusBadge = (paymentStatus: string, ticketStatus: string) => {
    if (ticketStatus === 'Liberado') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✅ Liberado</span>
    }
    if (paymentStatus === 'Pago') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">💳 Pago</span>
    }
    return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">⏳ Pendente</span>
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Comum': 'bg-gray-100 text-gray-800',
      'Cooperado': 'bg-blue-100 text-blue-800',
      'Evento': 'bg-purple-100 text-purple-800',
      'Proprietario': 'bg-green-100 text-green-800'
    }
    return (
      <span className={`px-2 py-1 ${colors[role] || 'bg-gray-100 text-gray-800'} rounded text-xs font-medium`}>
        {role}
      </span>
    )
  }

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <NavigationButtons />
      
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/dunar-icon.svg" alt="Dunar" width={48} height={48} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Controle de Acesso</h1>
              <p className="text-sm text-gray-600">Liberação de Veículos</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca por Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Buscar por Placa
              </label>
              <input
                type="text"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                placeholder="ABC-1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Filtrar por Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="pending">Pagamento Pendente</option>
                <option value="paid">Pagos (Aguardando Liberação)</option>
                <option value="released">Liberados</option>
              </select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{tickets.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-800">
                {tickets.filter(t => t.paymentStatus === 'Pendente').length}
              </div>
              <div className="text-sm text-orange-600">Pendentes</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-800">
                {tickets.filter(t => t.paymentStatus === 'Pago' && t.ticketStatus !== 'Liberado').length}
              </div>
              <div className="text-sm text-blue-600">Aguardando</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-800">
                {tickets.filter(t => t.ticketStatus === 'Liberado').length}
              </div>
              <div className="text-sm text-green-600">Liberados</div>
            </div>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Carregando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum ticket encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passageiros</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{ticket.vehicle.plate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{ticket.vehicle.user.name}</div>
                        {ticket.vehicle.user.phone && (
                          <div className="text-sm text-gray-500">{ticket.vehicle.user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(ticket.vehicle.plateRole)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.passengers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.isFree ? (
                          <span className="text-sm font-medium text-green-600">GRÁTIS 🎁</span>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            R$ {(ticket.price || 0).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ticket.paymentStatus, ticket.ticketStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.ticketStatus === 'Liberado' ? (
                          <div className="text-sm text-gray-500">
                            Liberado {ticket.releasedAt && new Date(ticket.releasedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : ticket.paymentStatus === 'Pendente' ? (
                          <button
                            onClick={() => handleRelease(ticket.id, 'solicitar_pagamento')}
                            disabled={releasing === ticket.id}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                          >
                            {releasing === ticket.id && (
                              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {releasing === ticket.id ? 'Enviando...' : 'Solicitar Pagamento'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRelease(ticket.id)}
                            disabled={releasing === ticket.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                          >
                            {releasing === ticket.id && (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {releasing === ticket.id ? 'Liberando...' : '🚗 Liberar Acesso'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  )
}
