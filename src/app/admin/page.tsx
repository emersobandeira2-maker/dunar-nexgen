"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Page from "@/components/ui/page";
import Logo from "@/components/ui/logo";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import NavigationButtons from "@/components/ui/navigation-buttons";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Carregar credenciais salvas ao montar o componente
  useEffect(() => {
    const savedUsername = localStorage.getItem("dunar_saved_username");
    const savedPassword = localStorage.getItem("dunar_saved_password");
    const savedRemember = localStorage.getItem("dunar_remember_me");

    if (savedRemember === "true" && savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar ou remover credenciais baseado no checkbox
        if (rememberMe) {
          localStorage.setItem("dunar_saved_username", username);
          localStorage.setItem("dunar_saved_password", password);
          localStorage.setItem("dunar_remember_me", "true");
        } else {
          localStorage.removeItem("dunar_saved_username");
          localStorage.removeItem("dunar_saved_password");
          localStorage.removeItem("dunar_remember_me");
        }

        router.push("/admin/pagamentos");
      } else {
        setError(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <NavigationButtons position="top-left" showForward={false} />
      
      <Form onSubmit={handleSubmit}>
        <Logo href="/admin" title="Painel de Administração" />

        <div className="flex flex-col gap-2 w-full">
          <Input
            type="text"
            placeholder="Usuário"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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

          {/* Checkbox de Lembrar Usuário e Senha */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-background-muted text-primary focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-white cursor-pointer select-none">
              Lembrar usuário e senha
            </label>
          </div>

          <Button
            type="submit"
            text={loading ? "Entrando..." : "Login"}
            className="w-full"
            disabled={loading}
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-center items-center gap-1 text-sm opacity-90">
            <span>Esqueceu a senha?</span>
            <Link
              href="/admin/recuperar-senha"
              className="underline text-link hover:text-link/80"
            >
              Recuperar
            </Link>
          </div>
        </div>
      </Form>
    </Page>
  );
}
