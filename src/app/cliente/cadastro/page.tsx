"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Page from "@/components/ui/page"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import Form from "@/components/ui/form"
import NavigationButtons from "@/components/ui/navigation-buttons"

export default function Cadastro() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF")
  const [document, setDocument] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "")
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    } else {
      v = v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
    }
    setPhone(v)
  }

  function handleDocumentChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "")
    
    if (documentType === "CPF") {
      // Máscara CPF: 000.000.000-00
      if (v.length > 11) v = v.slice(0, 11)
      v = v.replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    } else {
      // Máscara CNPJ: 00.000.000/0000-00
      if (v.length > 14) v = v.slice(0, 14)
      v = v.replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    }
    
    setDocument(v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/cliente/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone.replace(/\D/g, ""),
          documentType,
          document: document.replace(/\D/g, ""),
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Cadastro realizado com sucesso! Faça login para continuar.")
        router.push("/cliente")
      } else {
        setError(data.error || "Erro ao cadastrar")
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
        <Logo href="/cliente" title="Cadastro" />

        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          <Input
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />

          <Input
            placeholder="Telefone"
            value={phone}
            onChange={handlePhoneChange}
            required
            className="w-full"
          />

          {/* Seleção de Tipo de Documento - Melhorada para Mobile */}
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-white block">Tipo de Documento</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <label className="flex items-center gap-3 cursor-pointer bg-background-muted p-3 rounded-lg hover:bg-background-strong-muted transition-colors">
                <input
                  type="radio"
                  name="documentType"
                  value="CPF"
                  checked={documentType === "CPF"}
                  onChange={(e) => {
                    setDocumentType("CPF")
                    setDocument("") // Limpa o campo ao trocar
                  }}
                  className="w-5 h-5 text-primary bg-background border-gray-600 focus:ring-primary focus:ring-2"
                />
                <span className="text-gray-200 font-medium">CPF (Pessoa Física)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer bg-background-muted p-3 rounded-lg hover:bg-background-strong-muted transition-colors">
                <input
                  type="radio"
                  name="documentType"
                  value="CNPJ"
                  checked={documentType === "CNPJ"}
                  onChange={(e) => {
                    setDocumentType("CNPJ")
                    setDocument("") // Limpa o campo ao trocar
                  }}
                  className="w-5 h-5 text-primary bg-background border-gray-600 focus:ring-primary focus:ring-2"
                />
                <span className="text-gray-200 font-medium">CNPJ (Pessoa Jurídica)</span>
              </label>
            </div>
          </div>

          <Input
            placeholder={documentType === "CPF" ? "CPF" : "CNPJ"}
            value={document}
            onChange={handleDocumentChange}
            required
            className="w-full"
          />

          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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

          <Button
            type="submit"
            text={loading ? "Cadastrando..." : "Cadastrar"}
            className="w-full mt-2"
            disabled={loading}
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded">
              {error}
            </p>
          )}
        </div>

        <div className="text-center mt-2">
          <Link href="/cliente" className="text-link hover:text-link/80 hover:underline text-sm sm:text-base">
            Já possuo uma conta
          </Link>
        </div>
      </Form>
    </Page>
  )
}
