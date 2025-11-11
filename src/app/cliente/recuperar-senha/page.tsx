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
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/cliente/recuperar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage("Link de recuperação enviado! Verifique seu email.")
      } else {
        setError(data.error || "Erro ao solicitar recuperação de senha")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page>
      <NavigationButtons position="top-left" showForward={false} />
      
      <Form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6">
          <Logo href="/" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
          Recuperar Senha
        </h1>

        <p className="text-gray-300 text-center mb-6 text-sm">
          Digite seu email cadastrado e enviaremos um link para redefinir sua senha.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded text-green-500 text-sm">
            {message}
          </div>
        )}

        {!success && (
          <>
            <div className="space-y-4">
              <div>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <Button disabled={loading}>
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/cliente"
            className="text-primary hover:text-primary/80 transition-colors text-sm underline"
          >
            Voltar para o login
          </Link>
        </div>
      </Form>
    </Page>
  )
}
