"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSelector from "@/components/LanguageSelector"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [contactLoading, setContactLoading] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)
    
    setTimeout(() => {
      alert(t("home.messageSent"))
      setContactForm({ name: "", email: "", phone: "", message: "" })
      setContactLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navegação */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/dunar-icon.svg" alt="Dunar" className="h-16 w-auto" />
              <span className="ml-4 text-2xl font-bold text-gray-800">Complexo Dunar</span>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#sobre" className="text-gray-700 hover:text-[#6B7D4F] transition-colors font-medium">
                Sobre Nós
              </a>
              <a href="#servicos" className="text-gray-700 hover:text-[#6B7D4F] transition-colors font-medium">
                Serviços
              </a>
              <a href="#beneficios" className="text-gray-700 hover:text-[#6B7D4F] transition-colors font-medium">
                Benefícios
              </a>
              <a href="#contato" className="text-gray-700 hover:text-[#6B7D4F] transition-colors font-medium">
                Contato
              </a>
              <LanguageSelector />
              <button
                onClick={() => router.push("/cliente")}
                className="bg-[#E85D3D] hover:bg-[#d54d2d] text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ACESSE O SISTEMA
              </button>
            </nav>

            {/* Menu Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSelector />
              <button className="text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6B7D4F]/20 to-[#4A5D3A]/20">
          <img 
            src="/hero-dunar.jpg" 
            alt="Complexo Dunar Búzios" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-lg sm:text-xl mb-4 tracking-wide">Gestão completa de reservas e pagamentos</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            COMPLEXO DUNAR BÚZIOS
          </h1>
          <p className="text-xl sm:text-2xl mb-8 font-light">
            Tecnologia de ponta para o seu negócio
          </p>
        </div>

        {/* Botão WhatsApp Flutuante */}
        <a
          href="https://wa.me/5584999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </section>

      {/* Seção Sobre - Duas Colunas */}
      <section id="sobre" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <p className="text-[#C4A962] text-sm font-semibold tracking-widest mb-3 uppercase">
                Dunar NexGen
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Gestão completa de reservas e pagamentos
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sistema integrado para gerenciar reservas, processar pagamentos e controlar acessos com tecnologia de ponta e segurança máxima. Oferecemos soluções completas para gestão de reservas e pagamentos, com tecnologia de ponta e suporte especializado.
              </p>
              <button
                onClick={() => router.push("#servicos")}
                className="bg-[#6B7D4F] hover:bg-[#5a6a42] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Saiba mais
              </button>
            </div>

            {/* Grid de Imagens */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img 
                  src="/dunar-sunset-1.jpg" 
                  alt="Sistema" 
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              <img 
                src="/dunar-aerial-1.jpg" 
                alt="Gestão" 
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
              <img 
                src="/dunar-aerial-2.jpg" 
                alt="Tecnologia" 
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Serviços - Fundo Verde com Lista */}
      <section id="servicos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#6B7D4F]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem */}
            <div>
              <img 
                src="/dunar-sunset-2.jpg" 
                alt="Serviços" 
                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* Texto e Lista */}
            <div className="text-white">
              <p className="text-[#C4A962] text-sm font-semibold tracking-widest mb-3 uppercase">
                Sistema Completo
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Descubra
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-[#C4A962] mb-8">
                nossas soluções
              </h2>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#C4A962] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Pagamentos Online com Mercado Pago</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#C4A962] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Gestão de Reservas em Tempo Real</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#C4A962] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Controle de Acesso Inteligente</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#C4A962] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Relatórios e Dashboards Completos</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#C4A962] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Portal do Cliente Intuitivo</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#C4A962] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Segurança Avançada com 2FA</span>
                </li>
              </ul>

              <button
                onClick={() => router.push("/cliente")}
                className="bg-[#E85D3D] hover:bg-[#d54d2d] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
              >
                Acesse o Sistema Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Benefícios */}
      <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C4A962] text-sm font-semibold tracking-widest mb-3 uppercase">
              Tecnologia de Ponta
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Por Que Escolher o Dunar NexGen?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Desenvolvido com as melhores tecnologias do mercado para oferecer performance, segurança e facilidade de uso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefício 1 */}
            <div className="flex gap-6 p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#6B7D4F]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6B7D4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Performance Otimizada</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sistema desenvolvido com Next.js e React para garantir velocidade de carregamento e experiência fluida em qualquer dispositivo.
                </p>
              </div>
            </div>

            {/* Benefício 2 */}
            <div className="flex gap-6 p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#6B7D4F]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6B7D4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Confiabilidade Total</h3>
                <p className="text-gray-600 leading-relaxed">
                  Infraestrutura robusta com backup automático, alta disponibilidade e suporte técnico especializado para garantir operação contínua.
                </p>
              </div>
            </div>

            {/* Benefício 3 */}
            <div className="flex gap-6 p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#6B7D4F]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6B7D4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Responsivo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Interface adaptada para todos os dispositivos - smartphones, tablets e desktops. Seus clientes podem acessar de qualquer lugar.
                </p>
              </div>
            </div>

            {/* Benefício 4 */}
            <div className="flex gap-6 p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#6B7D4F]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6B7D4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Economia de Tempo e Recursos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatize processos manuais, reduza erros operacionais e libere sua equipe para focar no que realmente importa: o atendimento ao cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section com Imagem de Fundo */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/dunar-sunset-3.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comece a usar hoje mesmo
          </h2>
          <p className="text-xl mb-8 font-light tracking-wide uppercase">
            Sistema Completo de Gestão
          </p>
          <button
            onClick={() => router.push("/cliente")}
            className="bg-[#E85D3D] hover:bg-[#d54d2d] text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
          >
            Acesse o Sistema Agora
          </button>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#4A5D3A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
            {/* Coluna 1: Fale com a gente */}
            <div>
              <p className="text-[#C4A962] text-sm font-semibold tracking-widest mb-4 uppercase">
                Horário Comercial
              </p>
              <h3 className="text-2xl font-bold mb-6">Fale com a gente</h3>
              <div className="space-y-3">
                <p className="text-lg">(84) 3000-0000</p>
                <p className="text-lg">(84) 99999-9999</p>
                <p className="text-lg mt-4">contato@dunarnexgen.com.br</p>
                <p className="text-lg">suporte@dunarnexgen.com.br</p>
              </div>
            </div>

            {/* Coluna 2: Redes Sociais */}
            <div>
              <p className="text-[#C4A962] text-sm font-semibold tracking-widest mb-4 uppercase">
                Nossas Redes Sociais
              </p>
              <h3 className="text-2xl font-bold mb-6">Conheça mais nossa estrutura</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Coluna 3: Horário */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Horário de funcionamento:</h3>
              <p className="text-lg mb-8 leading-relaxed">
                Segunda a Sexta: 8h às 18h<br />
                Sábado: 8h às 12h
              </p>
              <button
                onClick={() => router.push("/cliente")}
                className="bg-[#E85D3D] hover:bg-[#d54d2d] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
              >
                Acesse o Sistema
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3a4d2a] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2025 Dunar NexGen. Todos os direitos reservados.</p>
          <p className="text-xs mt-2 text-gray-400">Sistema de Gestão de Reservas e Pagamentos</p>
        </div>
      </footer>
    </div>
  )
}
