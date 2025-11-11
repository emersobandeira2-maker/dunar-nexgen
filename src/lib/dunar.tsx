import { PropsWithChildren } from "react"
import { concate } from "@/utils"

export enum PlateRoles {
  Standard = "Comum",
  Partner = "Cooperado",
  Event = "Evento",
  Owner = "Proprietario"
}

export enum PaymentStatus {
  Paid = "Pago",
  Pending = "Pendente"
}

export enum TicketStatus {
  Granted = "Liberado",
  Pending = "Aguardando Liberação",
  Expired = "Expirado"
}

export type Ticket = {
  plate: string,
  passengers: number,
  useDate: string,
  plateRole: PlateRoles,
  paymentStatus: PaymentStatus,
  ticketStatus: TicketStatus,
  price?: number
}

export type Reservation = {
  plate: string
  passengers: number
  plateRole: PlateRoles,
  start: string
  end: string
}

export function PlateColor({ plateRole, className, children }: { plateRole: PlateRoles, className?: string } & PropsWithChildren) {
  const plateColorMap: Record<PlateRoles, string> = {
    [PlateRoles.Standard]: "bg-plate-standard",
    [PlateRoles.Partner]: "bg-plate-partner",
    [PlateRoles.Event]: "bg-plate-event",
    [PlateRoles.Owner]: "bg-plate-owner",
  }

  return (
    <div className={concate("flex justify-center items-center p-2 rounded-md whitespace-nowrap", plateColorMap[plateRole], className!)}>
      {children}
    </div>
  )
}

export function TicketColor({ ticketStatus, paymentStatus, className, children, onClick }: { ticketStatus: TicketStatus, paymentStatus: PaymentStatus, className?: string, onClick?: () => void } & PropsWithChildren) {
  const ticketColorMap: Record<TicketStatus, string> = {
    [TicketStatus.Granted]: "bg-payment-granted",
    [TicketStatus.Pending]: "bg-payment-pending",
    [TicketStatus.Expired]: "bg-payment-expired",
  }

  const waitingConfirmation = paymentStatus == PaymentStatus.Paid && ticketStatus == TicketStatus.Pending

  return (
    <div className={concate(
      "flex justify-center items-center p-2 rounded-md whitespace-nowrap",
      waitingConfirmation ? "cursor-pointer" : "",
      ticketColorMap[ticketStatus], className!)} onClick={onClick}>
      {children}
    </div>
  )
}