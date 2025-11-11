"use client"

import { useEffect, useState } from "react"
import { Ticket, PlateRoles, PaymentStatus, TicketStatus } from "@/lib/dunar"
import { useRouter } from "next/navigation"
import Menu from "@/app/admin/components/menu"
import Page from "@/components/ui/page"
import Card from "@/components/ui/card"
import Logo from "@/components/ui/logo"
import Modal from "@/components/ui/modal"
import Button from "@/components/ui/button"
import Image from "next/image"
import LogoutIcon from "public/icons/logout-icon.svg"
import NavigationButtons from "@/components/ui/navigation-buttons"

type FilterType = 'day' | 'period' | 'month' | 'year'

interface ReportStats {
  totalEntries: number
  totalRevenue: number
  paidCount: number
  pendingCount: number
  byCategory: {
    visitante: number
    cooperado: number
    eventos: number
    proprietario: number
  }
}

export default function AdminRelatorios() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<FilterType>('day')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [stats, setStats] = useState<ReportStats>({
    totalEntries: 0,
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    byCategory: {
      visitante: 0,
      cooperado: 0,
      eventos: 0,
      proprietario: 0
    }
  })

  const router = useRouter()

  // Carregar dados (simulado - substituir por API real)
  useEffect(() => {
    const mockTickets: Ticket[] = Array.from({ length: 50 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90)) // Últimos 90 dias
      
      const roles = [PlateRoles.Standard, PlateRoles.Partner, PlateRoles.Event, PlateRoles.Owner]
      const statuses = [PaymentStatus.Paid, PaymentStatus.Pending, PaymentStatus.Paid, PaymentStatus.Paid] // 75% pagos
      
      return {
        plate: `ABC-${1000 + i}`,
        passengers: Math.floor(Math.random() * 5) + 1,
        useDate: date.toLocaleDateString('pt-BR'),
        plateRole: roles[Math.floor(Math.random() * roles.length)],
        paymentStatus: statuses[Math.floor(Math.random() * statuses.length)],
        ticketStatus: TicketStatus.Granted,
        price: 50 + Math.floor(Math.random() * 150) // R$ 50 a R$ 200
      }
    })
    
    setTickets(mockTickets)
    setFilteredTickets(mockTickets)
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...tickets]

    switch (filterType) {
      case 'day':
        if (selectedDate) {
          const targetDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')
          filtered = tickets.filter(t => t.useDate === targetDate)
        }
        break

      case 'period':
        if (startDate && endDate) {
          const start = new Date(startDate + 'T00:00:00')
          const end = new Date(endDate + 'T23:59:59')
          
          filtered = tickets.filter(t => {
            const [day, month, year] = t.useDate.split('/')
            const ticketDate = new Date(`${year}-${month}-${day}`)
            return ticketDate >= start && ticketDate <= end
          })
        }
        break

      case 'month':
        if (selectedMonth) {
          const [year, month] = selectedMonth.split('-')
          filtered = tickets.filter(t => {
            const [day, m, y] = t.useDate.split('/')
            return y === year && m === month.padStart(2, '0')
          })
        }
        break

      case 'year':
        if (selectedYear) {
          filtered = tickets.filter(t => {
            const [day, month, year] = t.useDate.split('/')
            return year === selectedYear
          })
        }
        break
    }

    setFilteredTickets(filtered)

    // Calcular estatísticas
    const newStats: ReportStats = {
      totalEntries: filtered.length,
      totalRevenue: filtered.reduce((sum, t) => sum + (t.price || 0), 0),
      paidCount: filtered.filter(t => t.paymentStatus === PaymentStatus.Paid).length,
      pendingCount: filtered.filter(t => t.paymentStatus === PaymentStatus.Pending).length,
      byCategory: {
        visitante: filtered.filter(t => t.plateRole === PlateRoles.Standard).length,
        cooperado: filtered.filter(t => t.plateRole === PlateRoles.Partner).length,
        eventos: filtered.filter(t => t.plateRole === PlateRoles.Event).length,
        proprietario: filtered.filter(t => t.plateRole === PlateRoles.Owner).length,
      }
    }

    setStats(newStats)
  }, [filterType, selectedDate, startDate, endDate, selectedMonth, selectedYear, tickets])

  // Exportar para PDF
  const exportToPDF = () => {
    // Criar conteúdo HTML para o PDF
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório - Complexo Dunar</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #6B7D4F; text-align: center; }
          h2 { color: #4A5D3A; margin-top: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { border: 2px solid #6B7D4F; padding: 15px; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #6B7D4F; }
          .stat-label { font-size: 14px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #6B7D4F; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPLEXO DUNAR BÚZIOS</h1>
          <h2>Relatório de Entradas e Pagamentos</h2>
          <p><strong>Período:</strong> ${getFilterDescription()}</p>
          <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>

        <h2>Resumo Estatístico</h2>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${stats.totalEntries}</div>
            <div class="stat-label">Total de Entradas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">R$ ${stats.totalRevenue.toFixed(2)}</div>
            <div class="stat-label">Receita Total</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.paidCount}</div>
            <div class="stat-label">Pagamentos Confirmados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.pendingCount}</div>
            <div class="stat-label">Pagamentos Pendentes</div>
          </div>
        </div>

        <h2>Entradas por Categoria</h2>
        <table>
          <tr>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Percentual</th>
          </tr>
          <tr>
            <td>Visitante</td>
            <td>${stats.byCategory.visitante}</td>
            <td>${((stats.byCategory.visitante / stats.totalEntries) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Cooperado</td>
            <td>${stats.byCategory.cooperado}</td>
            <td>${((stats.byCategory.cooperado / stats.totalEntries) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Eventos</td>
            <td>${stats.byCategory.eventos}</td>
            <td>${((stats.byCategory.eventos / stats.totalEntries) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Proprietário</td>
            <td>${stats.byCategory.proprietario}</td>
            <td>${((stats.byCategory.proprietario / stats.totalEntries) * 100).toFixed(1)}%</td>
          </tr>
        </table>

        <h2>Detalhamento de Entradas</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Placa</th>
              <th>Passageiros</th>
              <th>Categoria</th>
              <th>Status Pagamento</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTickets.map(ticket => `
              <tr>
                <td>${ticket.useDate}</td>
                <td>${ticket.plate}</td>
                <td>${ticket.passengers}</td>
                <td>${getRoleLabel(ticket.plateRole)}</td>
                <td>${ticket.paymentStatus === PaymentStatus.Paid ? 'Pago' : 'Pendente'}</td>
                <td>R$ ${(ticket.price || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Relatório gerado automaticamente pelo Sistema Dunar NexGen</p>
          <p>© ${new Date().getFullYear()} Complexo Dunar Búzios - Todos os direitos reservados</p>
        </div>
      </body>
      </html>
    `

    // Abrir em nova janela para impressão/salvar como PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(content)
      printWindow.document.close()
      
      // Aguardar carregamento e abrir diálogo de impressão
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  const getFilterDescription = () => {
    switch (filterType) {
      case 'day':
        return new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')
      case 'period':
        return `${new Date(startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(endDate + 'T00:00:00').toLocaleDateString('pt-BR')}`
      case 'month':
        const [year, month] = selectedMonth.split('-')
        return `${month}/${year}`
      case 'year':
        return selectedYear
      default:
        return ''
    }
  }

  const getRoleLabel = (role: PlateRoles) => {
    switch (role) {
      case PlateRoles.Standard: return 'Visitante'
      case PlateRoles.Partner: return 'Cooperado'
      case PlateRoles.Event: return 'Eventos'
      case PlateRoles.Owner: return 'Proprietário'
      default: return role
    }
  }

  return (
    <>
      <Page>
        <NavigationButtons position="top-left" />
        
        {/* Logout */}
        <button className="absolute top-0 right-0 m-3 hover:cursor-pointer" onClick={() => setLogoutModalOpen(true)}>
          <Image src={LogoutIcon} alt="Logout" width={30} />
        </button>

        <div className="sm:max-w-[1200px] w-[95%] relative flex flex-col gap-5 p-pad rounded-lg sm:justify-start sm:items-start justify-center items-center bg-background/95 shadow-black shadow-2xl/70">

          {/* Painel Superior */}
          <div className="w-full flex flex-col justify-center items-center gap-2 text-center">
            <div className="relative w-40 h-40">
              <Logo href="/admin/pagamentos" />
            </div>
            <span className="text-[1.2rem] text-gray-50">Painel de Administrador</span>
            <Menu />
          </div>

          {/* Conteúdo Principal - Relatórios */}
          <div className="w-full flex flex-col gap-6">
            
            {/* Título */}
            <h2 className="text-2xl font-bold text-white text-center">📊 Relatórios</h2>

            {/* Filtros */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
              
              {/* Tipo de Filtro */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFilterType('day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'day' 
                      ? 'bg-[#C4A962] text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Dia Específico
                </button>
                <button
                  onClick={() => setFilterType('period')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'period' 
                      ? 'bg-[#C4A962] text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Período
                </button>
                <button
                  onClick={() => setFilterType('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'month' 
                      ? 'bg-[#C4A962] text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setFilterType('year')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'year' 
                      ? 'bg-[#C4A962] text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Ano
                </button>
              </div>

              {/* Campos de Filtro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterType === 'day' && (
                  <div>
                    <label className="block text-white mb-2">Data:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-[#C4A962]"
                    />
                  </div>
                )}

                {filterType === 'period' && (
                  <>
                    <div>
                      <label className="block text-white mb-2">Data Inicial:</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-[#C4A962]"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Data Final:</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-[#C4A962]"
                      />
                    </div>
                  </>
                )}

                {filterType === 'month' && (
                  <div>
                    <label className="block text-white mb-2">Mês:</label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-[#C4A962]"
                    />
                  </div>
                )}

                {filterType === 'year' && (
                  <div>
                    <label className="block text-white mb-2">Ano:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-[#C4A962]"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#6B7D4F] to-[#4A5D3A] p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.totalEntries}</div>
                <div className="text-sm opacity-80">Total de Entradas</div>
              </div>
              <div className="bg-gradient-to-br from-[#C4A962] to-[#A08940] p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div>
                <div className="text-sm opacity-80">Receita Total</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.paidCount}</div>
                <div className="text-sm opacity-80">Pagos</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.pendingCount}</div>
                <div className="text-sm opacity-80">Pendentes</div>
              </div>
            </div>

            {/* Por Categoria */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Entradas por Categoria</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C4A962]">{stats.byCategory.visitante}</div>
                  <div className="text-sm text-white/70">Visitante</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C4A962]">{stats.byCategory.cooperado}</div>
                  <div className="text-sm text-white/70">Cooperado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C4A962]">{stats.byCategory.eventos}</div>
                  <div className="text-sm text-white/70">Eventos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C4A962]">{stats.byCategory.proprietario}</div>
                  <div className="text-sm text-white/70">Proprietário</div>
                </div>
              </div>
            </div>

            {/* Botão Exportar */}
            <button
              onClick={exportToPDF}
              className="w-full bg-[#E85D3D] hover:bg-[#d54d2d] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>Exportar Relatório em PDF</span>
            </button>

            {/* Tabela de Dados */}
            <div className="bg-white/10 p-6 rounded-lg overflow-x-auto">
              <h3 className="text-lg font-semibold text-white mb-4">
                Detalhamento ({filteredTickets.length} registros)
              </h3>
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Placa</th>
                    <th className="text-left p-2">Pax</th>
                    <th className="text-left p-2">Categoria</th>
                    <th className="text-left p-2">Pagamento</th>
                    <th className="text-left p-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.slice(0, 20).map((ticket, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-2">{ticket.useDate}</td>
                      <td className="p-2">{ticket.plate}</td>
                      <td className="p-2">{ticket.passengers}</td>
                      <td className="p-2">{getRoleLabel(ticket.plateRole)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.paymentStatus === PaymentStatus.Paid 
                            ? 'bg-green-600' 
                            : 'bg-orange-600'
                        }`}>
                          {ticket.paymentStatus === PaymentStatus.Paid ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className="p-2">R$ {(ticket.price || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTickets.length > 20 && (
                <p className="text-white/50 text-sm mt-4 text-center">
                  Mostrando 20 de {filteredTickets.length} registros. Exporte para PDF para ver todos.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Logout */}
        <Modal open={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
          <Card>
            <span className="text-[1.2rem] text-center text-gray-50">Deseja sair?</span>
            <div className="w-full">
              <Button
                text="Sim"
                className="w-full mt-2"
                onClick={() => router.push("/admin")}
              />
              <Button text="Não" className="w-full mt-2" onClick={() => setLogoutModalOpen(false)} />
            </div>
          </Card>
        </Modal>
      </Page>
    </>
  )
}
