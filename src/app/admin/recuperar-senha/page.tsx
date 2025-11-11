"use client"

import { useState } from "react"
import Link from "next/link"
import Page from "@/components/ui/page"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import Form from "@/components/ui/form"
import NavigationButtons from "@/components/ui/navigation-buttons"

export default function RecuperarSenha() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Por favor, informe seu email")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/admin/recuperar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Link de recuperação enviado com sucesso!")
        setEmail("") // Limpar campo
      } else {
        setError(data.error || "Erro ao enviar link de recuperação")
      }
    } catch (err) {
      setError("Erro ao processar solicitação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <NavigationButtons />
      <Form onSubmit={handleSubmit}>
        <Logo
          href="/admin"
          title="Recuperar Senha"
          subtitle="Enviaremos um link de recuperação de senha."
        />

        <div className="w-full flex flex-col gap-2">
          <Input 
            type="email" 
            placeholder="Email" 
            required 
            className="min-w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          {message && (
            <div className="text-sm text-green-400 bg-green-400/10 p-3 rounded border border-green-400/30">
              {message}
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded border border-red-400/30">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            text={loading ? "Enviando..." : "Recuperar"} 
            className="w-full"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col text-center text-white/50 text-sm">
          <Link href="/admin" className="hover:text-link hover:underline">
            Lembrei a senha
          </Link>
        </div>
      </Form>
    </Page>
  )
}
