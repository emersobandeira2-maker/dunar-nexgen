"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Page from "@/components/ui/page"
import Logo from "@/components/ui/logo"
import Card from "@/components/ui/card"
import Image from "next/image"
import Button from "@/components/ui/button"
import SuccessIcon from "public/icons/success-green-icon.svg"
import CloseIcon from "public/icons/close-red-icon.svg"
import NavigationButtons from "@/components/ui/navigation-buttons"

function PaymentCard({ isSuccess, isPending, value, href }: { isSuccess: boolean, isPending?: boolean, value: number, href: string }) {
  const router = useRouter()

  return (
    <div className="w-full p-pad flex flex-col justify-center items-center rounded-lg bg-background-muted">
      <div className="my-5 rounded-lg bg-background-strong-muted">
        <div className="relative w-20 h-20">
          <Image src={isSuccess ? SuccessIcon : CloseIcon} alt="" fill />
        </div>
      </div>
      <span className="text-center font-semibold">
        {isSuccess 
          ? "Pagamento realizado com sucesso!" 
          : isPending 
          ? "Pagamento em processamento..." 
          : "Houve uma falha no pagamento!"}
      </span>

      <span className="text-[1.2rem] font-semibold text-gray-50">
        Valor {isSuccess ? "pago" : isPending ? "processando" : "pendente"}: R${value.toFixed(2)}
      </span>

      {isSuccess ?
        <div className="flex flex-col gap-2 mt-5 p-pad rounded-lg bg-background-strong-muted">
          <span>
            Sua reserva é válida por 24 horas. Nesse período, o usuário pode consultar horários e status do pagamento pela tela do sistema.
          </span>
          <span>
            Na portaria, a reserva já estará validada automaticamente, sem necessidade de apresentar comprovantes. Apenas será conferida a quantidade de passageiros informada no momento da reserva.
          </span>
        </div> 
        : isPending ?
        <div className="flex flex-col gap-2 mt-5 p-pad rounded-lg bg-background-strong-muted">
          <span className="text-center">
            Seu pagamento está sendo processado. Você receberá uma notificação quando for confirmado.
          </span>
          <Button text="Voltar ao Portal" className="w-full mt-2" onClick={() => router.push("/cliente/portal")} />
        </div>
        : <Button text="Tentar novamente" className="w-full mt-5" onClick={() => router.push(href)} />}
    </div>
  )
}

function ResultadoPagamentoContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<string | null>(null)
  const [paymentValue, setPaymentValue] = useState(50)

  useEffect(() => {
    const statusParam = searchParams.get("status")
    setStatus(statusParam)

    // Tentar obter o valor do pagamento dos parâmetros
    const collectionStatus = searchParams.get("collection_status")
    if (collectionStatus) {
      setStatus(collectionStatus === "approved" ? "success" : collectionStatus === "pending" ? "pending" : "failure")
    }
  }, [searchParams])

  const isSuccess = status === "success" || status === "approved"
  const isPending = status === "pending" || status === "in_process"

  return (
    <>
      <Page>
        <NavigationButtons position="top-left" showForward={false} />
        
        <Card>
          <Logo href="/cliente/portal" title="Resultado do Pagamento" />

          <div className="w-full flex flex-col gap-2">
            <PaymentCard 
              isSuccess={isSuccess} 
              isPending={isPending}
              value={paymentValue} 
              href="/cliente/portal" 
            />
          </div>

          {/* Informações de debug (remover em produção) */}
          <div className="mt-4 p-4 bg-background-muted rounded-lg text-xs opacity-60">
            <p><strong>Debug Info:</strong></p>
            <p>Status: {status || "N/A"}</p>
            <p>Payment ID: {searchParams.get("payment_id") || "N/A"}</p>
            <p>Collection Status: {searchParams.get("collection_status") || "N/A"}</p>
            <p>Preference ID: {searchParams.get("preference_id") || "N/A"}</p>
          </div>
        </Card>
      </Page>
    </>
  );
}

export default function ResultadoPagamento() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResultadoPagamentoContent />
    </Suspense>
  )
}
