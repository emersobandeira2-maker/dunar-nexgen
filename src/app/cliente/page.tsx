"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Page from "@/components/ui/page"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import Form from "@/components/ui/form"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSelector from "@/components/LanguageSelector"
import NavigationButtons from "@/components/ui/navigation-buttons"

export default function ClienteLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  // Carregar credenciais salvas ao montar o componente
  useEffect(() => {
    const savedEmail = localStorage.getItem("dunar_client_saved_email")
    const savedPassword = localStorage.getItem("dunar_client_saved_password")
    const savedRemember = localStorage.getItem("dunar_client_remember_me")

    if (savedRemember === "true" && savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/cliente/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Salvar ou remover credenciais baseado no checkbox
        if (rememberMe) {
          localStorage.setItem("dunar_client_saved_email", email)
          localStorage.setItem("dunar_client_saved_password", password)
          localStorage.setItem("dunar_client_remember_me", "true")
        } else {
          localStorage.removeItem("dunar_client_saved_email")
          localStorage.removeItem("dunar_client_saved_password")
          localStorage.removeItem("dunar_client_remember_me")
        }

        router.push("/cliente/portal")
      } else {
        setError(data.error || "Erro ao fazer login")
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
      
      <div className="absolute top-4 right-4 sm:right-6 z-50">
        <LanguageSelector />
      </div>
      
      <Form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6">
          <Logo href="/" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
          {t("client.login")}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Input
              label={t("client.username")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="relative">
            <Input
              label={t("client.password")}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors z-10"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Checkbox de Lembrar Usuário e Senha */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="rememberMeClient"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-background-muted text-primary focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="rememberMeClient" className="text-white cursor-pointer select-none">
              Lembrar usuário e senha
            </label>
          </div>

          <Button disabled={loading}>
            {loading ? "Entrando..." : t("client.login")}
          </Button>
        </div>

        <div className="mt-6 flex justify-center items-center gap-1 text-sm">
          <span className="text-gray-300">Esqueceu a senha?</span>
          <Link
            href="/cliente/recuperar-senha"
            className="text-primary hover:text-primary/80 transition-colors underline"
          >
            Recuperar
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 text-base mb-2">
            Não tem uma conta?
          </p>
          <Link
            href="/cliente/cadastro"
            className="text-primary hover:text-primary/80 transition-colors text-lg font-semibold underline"
          >
            Cadastre-se aqui
          </Link>
        </div>
      </Form>
    </Page>
  )
}
