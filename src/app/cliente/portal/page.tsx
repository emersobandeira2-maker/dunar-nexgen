"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Page from "@/components/ui/page"
import Logo from "@/components/ui/logo"
import Card from "@/components/ui/card"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Modal from "@/components/ui/modal"
import Form from "@/components/ui/form"
import { Table, TableHead, TableHeadChild, TableBody, TableBodyChild, TableBodyRow } from "@/components/ui/table"
import LogoutIcon from "public/icons/logout-icon.svg"
import NavigationButtons from "@/components/ui/navigation-buttons"

type User = {
  id: string
  name: string
  email: string
  phone?: string | null
  lifetimePrize?: boolean
}

type Reservation = {
  id: string
  passengers: number
  startDate: string
  endDate: string
  status: string
  vehicle: {
    plate: string
  }
  tickets: Array<{
    id: string
    paymentStatus: string
    ticketStatus: string
  }>
}

export default function Portal() {
  const [user, setUser] = useState<User | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false)
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false)
  
  const [plate, setPlate] = useState("")
  const [passengers, setPassengers] = useState(1)
  const [visitDate, setVisitDate] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Estados separados para acesso avulso
  const [walkInPlate, setWalkInPlate] = useState("")
  const [walkInPassengers, setWalkInPassengers] = useState(1)
  const [walkInLoading, setWalkInLoading] = useState(false)
  const [lifetimePrizeStatus, setLifetimePrizeStatus] = useState<any>(null)
  
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchReservations()
    fetchLifetimePrizeStatus()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/cliente/session")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push("/cliente")
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      router.push("/cliente")
    }
  }

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/cliente/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error)
    }
  }

  const fetchLifetimePrizeStatus = async () => {
    try {
      const response = await fetch("/api/cliente/lifetime-prize-status")
      if (response.ok) {
        const data = await response.json()
        setLifetimePrizeStatus(data)
      }
    } catch (error) {
      console.error("Erro ao buscar status do prêmio vitalício:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/cliente/logout", { method: "POST" })
      router.push("/cliente")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      router.push("/cliente")
    }
  }

  const handleNewReservation = async () => {
    if (!plate || !visitDate || passengers < 1) {
      alert("Preencha todos os campos corretamente")
      return
    }

    setLoading(true)
    try {
      // Criar preferência de pagamento
      const response = await fetch("/api/payment/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Reserva - ${plate}`,
          quantity: passengers,
          unit_price: user?.lifetimePrize ? 0.00 : 50.00, // Preço 0 se tiver prêmio vitalício
          userId: user?.id,
          plate,
          visitDate,
          type: "reservation" // Agendamento
        }),
      })

      const data = await response.json()

      if (response.ok && data.init_point) {
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = data.init_point
      } else {
        alert(data.error || "Erro ao criar reserva")
      }
    } catch (error) {
      console.error("Erro ao criar reserva:", error)
      alert("Erro ao criar reserva")
    } finally {
      setLoading(false)
    }
  }

  const handleWalkIn = async () => {
    if (!walkInPlate || walkInPassengers < 1) {
      alert("Preencha todos os campos corretamente")
      return
    }

    setWalkInLoading(true)
    try {
      // Criar preferência de pagamento para acesso avulso
      const response = await fetch("/api/payment/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Acesso Avulso - ${walkInPlate}`,
          quantity: walkInPassengers,
          unit_price: user?.lifetimePrize ? 0.00 : 50.00, // Preço 0 se tiver prêmio vitalício
          userId: user?.id,
          plate: walkInPlate,
          visitDate: new Date().toISOString().split('T')[0], // Data de hoje
          type: "walk-in" // Acesso avulso
        }),
      })

      const data = await response.json()

      if (response.ok && data.init_point) {
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = data.init_point
      } else {
        alert(data.error || "Erro ao criar acesso avulso")
      }
    } catch (error) {
      console.error("Erro ao criar acesso avulso:", error)
      alert("Erro ao criar acesso avulso")
    } finally {
      setWalkInLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
      case "Liberado":
        return "text-green-500"
      case "Pendente":
      case "Aguardando Liberação":
        return "text-yellow-500"
      case "Expirado":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  if (!user) {
    return (
      <Page className="flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </Page>
    )
  }

  return (
    <>
      <Page className="flex flex-col gap-5">
        <NavigationButtons position="top-left" />
        
        <button
          className="absolute top-0 right-0 m-3 hover:cursor-pointer"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <Image src={LogoutIcon} alt="Logout" width={30} />
        </button>

        <Form className="w-full">
          <Logo
            href="/cliente/portal"
            title="Portal do Cliente"
            subtitle={`Seja bem-vindo, ${user.name}!`}
          />
          
          {/* Badge Prêmio Vitalício */}
          {lifetimePrizeStatus?.hasLifetimePrize && (
            <div className="w-full bg-gradient-to-r from-[#C4A962] to-[#A08940] p-4 rounded-lg shadow-lg mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <h3 className="text-lg font-bold text-white">PRÊMIO VITALÍCIO ATIVO</h3>
                  </div>
                  <p className="text-white/90 text-sm mt-1">
                    Você tem <strong>{lifetimePrizeStatus.availableToday} de {lifetimePrizeStatus.totalFreePlatesPerDay} placas grátis</strong> disponíveis hoje!
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{lifetimePrizeStatus.availableToday}</div>
                  <div className="text-xs text-white/80">Grátis Hoje</div>
                </div>
              </div>
              {lifetimePrizeStatus.usedToday > 0 && (
                <div className="mt-2 text-xs text-white/70">
                  Você já usou {lifetimePrizeStatus.usedToday} placa(s) grátis hoje. Renova à meia-noite!
                </div>
              )}
            </div>
          )}
        </Form>

        <Card>
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold">Minhas Reservas</h2>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                text="Agendar Visita"
                onClick={() => setIsNewReservationModalOpen(true)}
                className="!w-full sm:!w-auto px-6"
              />
              <Button
                text="Acesso Avulso (Na Hora)"
                onClick={() => setIsWalkInModalOpen(true)}
                className="!w-full sm:!w-auto px-6 !bg-orange-600 hover:!bg-orange-700"
              />
            </div>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-8 opacity-60">
              <p>Você ainda não possui reservas.</p>
              <p className="text-sm mt-2">Clique em "Nova Reserva" para começar!</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableHeadChild border={false}>Placa</TableHeadChild>
                <TableHeadChild>Passageiros</TableHeadChild>
                <TableHeadChild>Data</TableHeadChild>
                <TableHeadChild>Pagamento</TableHeadChild>
                <TableHeadChild>Status</TableHeadChild>
              </TableHead>

              <TableBody>
                {reservations.map((reservation) => (
                  <TableBodyRow key={reservation.id}>
                    <TableBodyChild border={false}>
                      {reservation.vehicle.plate}
                    </TableBodyChild>
                    <TableBodyChild>{reservation.passengers}</TableBodyChild>
                    <TableBodyChild>{formatDate(reservation.startDate)}</TableBodyChild>
                    <TableBodyChild>
                      <span className={getStatusColor(reservation.tickets[0]?.paymentStatus || "Pendente")}>
                        {reservation.tickets[0]?.paymentStatus || "Pendente"}
                      </span>
                    </TableBodyChild>
                    <TableBodyChild>
                      <span className={getStatusColor(reservation.tickets[0]?.ticketStatus || "Aguardando")}>
                        {reservation.tickets[0]?.ticketStatus || "Aguardando"}
                      </span>
                    </TableBodyChild>
                  </TableBodyRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Page>

      {/* Modal de Acesso Avulso */}
      <Modal open={isWalkInModalOpen} onClose={() => setIsWalkInModalOpen(false)}>
        <Form>
          <span className="text-[1.2rem] text-center text-gray-50">Acesso Avulso (Na Hora)</span>
          <p className="text-sm text-center text-gray-400 mt-1">
            Para acesso imediato. Pague agora e aguarde a liberação do admin.
          </p>

          <div className="w-full flex flex-col gap-2 mt-2">
            <Input
              type="text"
              placeholder="Placa do Veículo (ex: ABC-1234)"
              className="min-w-full"
              value={walkInPlate}
              onChange={(e) => setWalkInPlate(e.target.value.toUpperCase())}
              required
            />

            <Input
              type="number"
              placeholder="Número de Passageiros"
              className="min-w-full"
              min="1"
              value={walkInPassengers}
              onChange={(e) => setWalkInPassengers(parseInt(e.target.value) || 1)}
              required
            />

            <div className="bg-background-muted p-3 rounded-lg text-sm">
              <p className="font-semibold mb-1">Valor Total:</p>
              <p className="text-2xl text-primary">
                R$ {(walkInPassengers * (user?.lifetimePrize ? 0 : 50)).toFixed(2)}
              </p>
              <p className="text-xs opacity-70 mt-1">
                R$ 50,00 por passageiro
              </p>
            </div>

            <div className="bg-yellow-500/20 p-3 rounded-lg text-sm">
              <p className="text-yellow-300 font-semibold">⚠️ Atenção:</p>
              <p className="text-xs text-gray-300 mt-1">
                Após o pagamento, aguarde a liberação do administrador para acessar.
              </p>
            </div>

            <div>
              <Button
                type="button"
                text={walkInLoading ? "Processando..." : "Realizar Pagamento"}
                className="w-full"
                onClick={handleWalkIn}
                disabled={walkInLoading}
              />

              <Button
                type="button"
                text="Fechar"
                className="w-full mt-2"
                onClick={() => setIsWalkInModalOpen(false)}
              />
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal de Nova Reserva */}
      <Modal open={isNewReservationModalOpen} onClose={() => setIsNewReservationModalOpen(false)}>
        <Form>
          <span className="text-[1.2rem] text-center text-gray-50">Nova Reserva</span>

          <div className="w-full flex flex-col gap-2 mt-2">
            <Input
              type="text"
              placeholder="Placa do Veículo (ex: ABC-1234)"
              className="min-w-full"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              required
            />

            <Input
              type="number"
              placeholder="Número de Passageiros"
              className="min-w-full"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
              required
            />

            <Input
              type="date"
              placeholder="Data da Visita"
              className="min-w-full"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />

            <div className="bg-background-muted p-3 rounded-lg text-sm">
              <p className="font-semibold mb-1">Valor Total:</p>
              <p className="text-2xl text-primary">
                R$ {(passengers * (user?.lifetimePrize ? 0 : 50)).toFixed(2)}
              </p>
              <p className="text-xs opacity-70 mt-1">
                R$ 50,00 por passageiro
              </p>
            </div>

            <div>
              <Button
                type="button"
                text={loading ? "Processando..." : "Realizar Pagamento"}
                className="w-full"
                onClick={handleNewReservation}
                disabled={loading}
              />

              <Button
                type="button"
                text="Fechar"
                className="w-full mt-2"
                onClick={() => setIsNewReservationModalOpen(false)}
              />
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal de Logout */}
      <Modal open={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
        <Card>
          <span className="text-[1.2rem] text-center text-gray-50">Deseja sair?</span>
          <div className="w-full">
            <Button text="Sim" className="w-full mt-2" onClick={handleLogout} />
            <Button
              text="Não"
              className="w-full mt-2"
              onClick={() => setIsLogoutModalOpen(false)}
            />
          </div>
        </Card>
      </Modal>
    </>
  )
}
