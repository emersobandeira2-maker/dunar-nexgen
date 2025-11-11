"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Page from "@/components/ui/page"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import Form from "@/components/ui/form"
import NavigationButtons from "@/components/ui/navigation-buttons"

function RedefinirSenhaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Token inválido ou ausente")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError("Token inválido")
      return
    }

    if (!password || !confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/redefinir-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Senha redefinida com sucesso! Você será redirecionado para o login.")
        router.push("/admin")
      } else {
        setError(data.error || "Erro ao redefinir senha")
      }
    } catch (err) {
      setError("Erro ao processar solicitação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Page>
      <NavigationButtons />
      <Form onSubmit={handleSubmit}>
        <Logo
          href="/admin"
          title="Redefinir Senha"
          subtitle="Digite sua nova senha."
        />

        <div className="w-full flex flex-col gap-2">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nova Senha"
              required
              className="min-w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || !token}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar Nova Senha"
            required
            className="min-w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || !token}
          />

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded border border-red-400/30">
              {error}
            </div>
          )}

          <Button
            type="submit"
            text={loading ? "Redefinindo..." : "Redefinir Senha"}
            className="w-full"
            disabled={loading || !token}
          />
        </div>
      </Form>
    </Page>
    </Suspense>
  )
}

export default function RedefinirSenha() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaContent />
    </Suspense>
  )
}
