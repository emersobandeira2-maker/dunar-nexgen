"use client"

import { useEffect, useState } from "react"

import { Ticket, PlateRoles, PaymentStatus, TicketStatus, PlateColor, TicketColor } from "@/lib/dunar"
import { Table, TableHead, TableHeadChild, TableBody, TableBodyChild } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import Image from "next/image"

import Menu from "@/app/admin/components/menu"
import Page from "@/components/ui/page"
import Form from "@/components/ui/form"
import Input from "@/components/ui/input"
import Logo from "@/components/ui/logo"
import Card from "@/components/ui/card"
import IconedButton from "@/components/ui/iconed-button"
import SearchInput from "@/components/ui/search-input"
import PlateExample from "@/components/ui/plate-example"
import Modal from "@/components/ui/modal"
import Button from "@/components/ui/button"
import Select from "@/components/ui/select"
import NavigationButtons from "@/components/ui/navigation-buttons"

import RegisterIcon from "public/icons/register-icon.svg"
import LogoutIcon from "public/icons/logout-icon.svg"

type TicketWithVehicle = {
  id: string
  plate: string
  passengers: number
  useDate: string
  plateRole: PlateRoles
  paymentStatus: PaymentStatus
  ticketStatus: TicketStatus
}

export default function AdminDashboard() {
  const [isReserveModalOpen, setReserveModalOpen] = useState(false)
  const [isEntryConfirmModalOpen, setEntryConfirmModalOpen] = useState(false)
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)
  const [ticketList, setTicketList] = useState<TicketWithVehicle[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [today, setToday] = useState("")
  
  // Form state
  const [formPlate, setFormPlate] = useState("")
  const [formPassengers, setFormPassengers] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formPlateRole, setFormPlateRole] = useState("Comum")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets")
      const data = await response.json()
      
      const formattedTickets: TicketWithVehicle[] = data.map((ticket: any) => ({
        id: ticket.id,
        plate: ticket.vehicle.plate,
        passengers: ticket.passengers,
        useDate: new Date(ticket.useDate).toLocaleDateString("pt-BR"),
        plateRole: ticket.vehicle.plateRole as PlateRoles,
        paymentStatus: ticket.paymentStatus as PaymentStatus,
        ticketStatus: ticket.ticketStatus as TicketStatus,
      }))
      
      setTicketList(formattedTickets)
    } catch (error) {
      console.error("Erro ao buscar tickets:", error)
    }
  }

  useEffect(() => {
    fetchTickets()
    const now = new Date()
    setToday(now.toISOString().split("T")[0])
  }, [])

  const handleCreateTicket = async () => {
    if (!formPlate || !formPassengers || !formDate) {
      alert("Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plate: formPlate,
          passengers: formPassengers,
          useDate: formDate,
          plateRole: formPlateRole,
          paymentStatus: "Pago",
        }),
      })

      if (response.ok) {
        setFormPlate("")
        setFormPassengers("")
        setFormDate("")
        setFormPlateRole("Comum")
        setReserveModalOpen(false)
        fetchTickets()
      } else {
        alert("Erro ao criar ticket")
      }
    } catch (error) {
      console.error("Erro ao criar ticket:", error)
      alert("Erro ao criar ticket")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEntry = async () => {
    if (!selectedTicketId) return

    try {
      const response = await fetch(`/api/tickets/${selectedTicketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketStatus: "Liberado",
        }),
      })

      if (response.ok) {
        setEntryConfirmModalOpen(false)
        setSelectedTicketId(null)
        fetchTickets()
      } else {
        alert("Erro ao liberar entrada")
      }
    } catch (error) {
      console.error("Erro ao liberar entrada:", error)
      alert("Erro ao liberar entrada")
    }
  }

  return (
    <>
      <Page>
        <NavigationButtons position="top-left" />
        
        <button className="absolute top-0 right-0 m-3 hover:cursor-pointer" onClick={() => setLogoutModalOpen(true)}>
          <Image src={LogoutIcon} alt="Logout" width={30} />
        </button>

        <div className="w-full max-w-[95%] sm:max-w-[800px] lg:max-w-[1000px] relative flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 md:p-8 rounded-lg bg-background/95 shadow-black shadow-2xl/70">

          <div className="w-full flex flex-col justify-center items-center gap-2 text-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <Logo href="/admin/pagamentos" />
            </div>

            <span className="text-lg sm:text-xl text-gray-50">Painel de Administrador</span>
            <Menu />
          </div>

          <div className="w-full flex flex-col gap-2">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-semibold">Pagamentos</h2>

              <IconedButton
                text="Reserva Avulsa"
                icon={RegisterIcon}
                onClick={() => setReserveModalOpen(true)}
                className="!w-full sm:!w-45"
              />
            </div>

            <div className="flex flex-col p-conpad gap-3 rounded-lg bg-background-muted">
              <SearchInput />
              <PlateExample />
            </div>

            <Table>
              <TableHead>
                <TableHeadChild border={false}>Placa</TableHeadChild>
                <TableHeadChild>Pax</TableHeadChild>
                <TableHeadChild>Pagamento</TableHeadChild>
                <TableHeadChild>Data de Uso</TableHeadChild>
                <TableHeadChild>Status Entrada</TableHeadChild>
              </TableHead>

              <TableBody>
                {ticketList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 opacity-60">
                      Nenhum ticket encontrado.
                    </td>
                  </tr>
                ) : (
                  ticketList.map((ticket) => (
                    <tr key={ticket.id}>
                      <TableBodyChild border={false}>
                        <PlateColor plateRole={ticket.plateRole}>{ticket.plate}</PlateColor>
                      </TableBodyChild>

                      <TableBodyChild>
                        {ticket.passengers} {ticket.passengers > 1 ? "Pessoas" : "Pessoa"}
                      </TableBodyChild>

                      <TableBodyChild>{ticket.paymentStatus}</TableBodyChild>
                      <TableBodyChild>{ticket.useDate}</TableBodyChild>

                      <TableBodyChild>
                        <TicketColor
                          ticketStatus={ticket.ticketStatus}
                          paymentStatus={ticket.paymentStatus}
                          onClick={() => {
                            if (ticket.paymentStatus === "Pago" && ticket.ticketStatus === "Aguardando Liberação") {
                              setSelectedTicketId(ticket.id)
                              setEntryConfirmModalOpen(true)
                            }
                          }}
                        >
                          {ticket.ticketStatus}
                        </TicketColor>
                      </TableBodyChild>
                    </tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Modal open={isReserveModalOpen} onClose={() => setReserveModalOpen(false)}>
          <Form>
            <span className="text-[1.2rem] text-center text-gray-50">Nova Reserva Avulsa</span>

            <div className="w-full flex flex-col gap-2 mt-2">
              <div className="flex">
                <span className="flex-1 text-white">Tipo Placa</span>
                <Select 
                  className="flex-4"
                  value={formPlateRole}
                  onChange={(e) => setFormPlateRole(e.target.value)}
                >
                  <option value="Comum">Comum</option>
                  <option value="Cooperado">Cooperado</option>
                  <option value="Evento">Eventos</option>
                  <option value="Proprietario">Proprietário</option>
                </Select>
              </div>

              <Input 
                type="date" 
                min={today} 
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required 
              />
              <Input 
                type="text" 
                placeholder="Placa: ABC-1245" 
                value={formPlate}
                onChange={(e) => setFormPlate(e.target.value)}
                required 
              />
              <Input 
                type="number" 
                placeholder="Passageiros: 0 a 7" 
                value={formPassengers}
                onChange={(e) => setFormPassengers(e.target.value)}
                required 
              />

              <div>
                <Button
                  text={loading ? "Cadastrando..." : "Cadastrar Entrada"}
                  className="w-full"
                  onClick={handleCreateTicket}
                  disabled={loading}
                />

                <Button 
                  text="Fechar" 
                  className="w-full mt-2 bg-cancel" 
                  onClick={() => setReserveModalOpen(false)} 
                />
              </div>
            </div>
          </Form>
        </Modal>

        <Modal open={isEntryConfirmModalOpen} onClose={() => setEntryConfirmModalOpen(false)}>
          <Card>
            <span className="text-[1.2rem] text-center text-gray-50">Confirmar Liberação?</span>
            <div className="w-full">
              <Button
                text="Sim"
                className="w-full mt-2"
                onClick={handleConfirmEntry}
              />
              <Button 
                text="Não" 
                className="w-full mt-2" 
                onClick={() => setEntryConfirmModalOpen(false)} 
              />
            </div>
          </Card>
        </Modal>

        <Modal open={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
          <Card>
            <span className="text-[1.2rem] text-center text-gray-50">Deseja sair?</span>
            <div className="w-full">
              <Button
                text="Sim"
                className="w-full mt-2"
                onClick={async () => {
                  try {
                    await fetch("/api/logout", { method: "POST" })
                    router.push("/admin")
                  } catch (error) {
                    console.error("Erro ao fazer logout:", error)
                    router.push("/admin")
                  }
                }}
              />
              <Button text="Não" className="w-full mt-2" onClick={() => setLogoutModalOpen(false)} />
            </div>
          </Card>
        </Modal>
      </Page>
    </>
  )
}
