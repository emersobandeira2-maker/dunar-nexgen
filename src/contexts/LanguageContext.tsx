"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "pt" | "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    // Carregar idioma salvo do localStorage
    const saved = localStorage.getItem("language") as Language
    if (saved && ["pt", "en", "es"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

// Traduções
const translations = {
  pt: {
    // Landing Page
    home: {
      title: "Sistema de Gestão de",
      titleHighlight: "Reservas e Pagamentos",
      subtitle: "Controle total de entradas, reservas e pagamentos online com tecnologia de ponta. Simplifique sua gestão e ofereça a melhor experiência aos seus clientes.",
      clientArea: "Área do Cliente",
      adminArea: "Área Administrativa",
      services: "Serviços",
      benefits: "Benefícios",
      contact: "Contato",
      ourServices: "Nossos Serviços",
      servicesDesc: "Oferecemos soluções completas para gestão de reservas e pagamentos, com tecnologia de ponta e suporte especializado.",
      whyChoose: "Por Que Escolher o Dunar NexGen?",
      benefitsDesc: "Desenvolvido com as melhores tecnologias do mercado para oferecer performance, segurança e facilidade de uso.",
      contactUs: "Entre em Contato",
      contactDesc: "Tem alguma dúvida ou deseja conhecer melhor nossas soluções? Preencha o formulário abaixo e nossa equipe entrará em contato.",
      fullName: "Nome Completo",
      email: "Email",
      phone: "Telefone",
      message: "Mensagem",
      sendMessage: "Enviar Mensagem",
      sending: "Enviando...",
      messageSent: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      address: "Endereço",
      businessHours: "Horário de Atendimento",
      mondayFriday: "Segunda a Sexta: 8h às 18h",
      saturday: "Sábado: 8h às 12h",
    },
    services: {
      onlinePayments: "Pagamentos Online",
      onlinePaymentsDesc: "Integração completa com Mercado Pago para processar pagamentos de forma segura e rápida. Aceite cartões de crédito, débito e PIX.",
      reservationManagement: "Gestão de Reservas",
      reservationManagementDesc: "Controle completo de reservas com status em tempo real, histórico detalhado e notificações automáticas para seus clientes.",
      accessControl: "Controle de Acesso",
      accessControlDesc: "Sistema de controle de entradas com validação de tickets, liberação manual e relatórios completos de movimentação.",
      reportsAnalytics: "Relatórios e Análises",
      reportsAnalyticsDesc: "Dashboards intuitivos com métricas em tempo real, gráficos de desempenho e relatórios personalizados para tomada de decisão.",
      clientPortal: "Portal do Cliente",
      clientPortalDesc: "Interface intuitiva para seus clientes gerenciarem suas reservas, realizarem pagamentos e acompanharem o histórico de transações.",
      advancedSecurity: "Segurança Avançada",
      advancedSecurityDesc: "Autenticação de dois fatores (2FA), criptografia de dados e proteção contra fraudes para garantir a segurança total do sistema.",
    },
    benefits: {
      optimizedPerformance: "Performance Otimizada",
      optimizedPerformanceDesc: "Sistema desenvolvido com Next.js e React para garantir velocidade de carregamento e experiência fluida em qualquer dispositivo.",
      totalReliability: "Confiabilidade Total",
      totalReliabilityDesc: "Infraestrutura robusta com backup automático, alta disponibilidade e suporte técnico especializado para garantir operação contínua.",
      fullyResponsive: "100% Responsivo",
      fullyResponsiveDesc: "Interface adaptada para todos os dispositivos - smartphones, tablets e desktops. Seus clientes podem acessar de qualquer lugar.",
      timeSavings: "Economia de Tempo e Recursos",
      timeSavingsDesc: "Automatize processos manuais, reduza erros operacionais e libere sua equipe para focar no que realmente importa: o atendimento ao cliente.",
    },
    // Área do Cliente
    client: {
      login: "Login",
      username: "Usuário",
      password: "Senha",
      rememberMe: "Lembrar usuário e senha",
      noAccount: "Não tenho uma conta",
      register: "Cadastrar",
      name: "Nome",
      cpf: "CPF",
      cnpj: "CNPJ",
      documentType: "Tipo de Documento",
      individualPerson: "CPF (Pessoa Física)",
      legalPerson: "CNPJ (Pessoa Jurídica)",
      alreadyHaveAccount: "Já tenho uma conta",
      welcome: "Bem-vindo",
      myReservations: "Minhas Reservas",
      newReservation: "Nova Reserva",
      plate: "Placa do Veículo",
      passengers: "Número de Passageiros",
      totalValue: "Valor Total",
      makePayment: "Realizar Pagamento",
      status: "Status",
      pending: "Pendente",
      paid: "Pago",
      cancelled: "Cancelado",
      noReservations: "Nenhuma reserva encontrada.",
      logout: "Sair",
    },
  },
  en: {
    // Landing Page
    home: {
      title: "Management System for",
      titleHighlight: "Reservations and Payments",
      subtitle: "Total control of entries, reservations and online payments with cutting-edge technology. Simplify your management and offer the best experience to your customers.",
      clientArea: "Client Area",
      adminArea: "Administrative Area",
      services: "Services",
      benefits: "Benefits",
      contact: "Contact",
      ourServices: "Our Services",
      servicesDesc: "We offer complete solutions for reservation and payment management, with cutting-edge technology and specialized support.",
      whyChoose: "Why Choose Dunar NexGen?",
      benefitsDesc: "Developed with the best market technologies to offer performance, security and ease of use.",
      contactUs: "Get in Touch",
      contactDesc: "Have any questions or want to learn more about our solutions? Fill out the form below and our team will contact you.",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      sendMessage: "Send Message",
      sending: "Sending...",
      messageSent: "Message sent successfully! We will contact you soon.",
      address: "Address",
      businessHours: "Business Hours",
      mondayFriday: "Monday to Friday: 8am to 6pm",
      saturday: "Saturday: 8am to 12pm",
    },
    services: {
      onlinePayments: "Online Payments",
      onlinePaymentsDesc: "Complete integration with Mercado Pago to process payments securely and quickly. Accept credit cards, debit cards and PIX.",
      reservationManagement: "Reservation Management",
      reservationManagementDesc: "Complete reservation control with real-time status, detailed history and automatic notifications for your customers.",
      accessControl: "Access Control",
      accessControlDesc: "Entry control system with ticket validation, manual release and complete movement reports.",
      reportsAnalytics: "Reports and Analytics",
      reportsAnalyticsDesc: "Intuitive dashboards with real-time metrics, performance graphs and customized reports for decision making.",
      clientPortal: "Client Portal",
      clientPortalDesc: "Intuitive interface for your customers to manage their reservations, make payments and track transaction history.",
      advancedSecurity: "Advanced Security",
      advancedSecurityDesc: "Two-factor authentication (2FA), data encryption and fraud protection to ensure total system security.",
    },
    benefits: {
      optimizedPerformance: "Optimized Performance",
      optimizedPerformanceDesc: "System developed with Next.js and React to ensure loading speed and smooth experience on any device.",
      totalReliability: "Total Reliability",
      totalReliabilityDesc: "Robust infrastructure with automatic backup, high availability and specialized technical support to ensure continuous operation.",
      fullyResponsive: "100% Responsive",
      fullyResponsiveDesc: "Interface adapted for all devices - smartphones, tablets and desktops. Your customers can access from anywhere.",
      timeSavings: "Time and Resource Savings",
      timeSavingsDesc: "Automate manual processes, reduce operational errors and free your team to focus on what really matters: customer service.",
    },
    // Client Area
    client: {
      login: "Login",
      username: "Username",
      password: "Password",
      rememberMe: "Remember username and password",
      noAccount: "I don't have an account",
      register: "Register",
      name: "Name",
      cpf: "CPF",
      cnpj: "CNPJ",
      documentType: "Document Type",
      individualPerson: "CPF (Individual)",
      legalPerson: "CNPJ (Company)",
      alreadyHaveAccount: "I already have an account",
      welcome: "Welcome",
      myReservations: "My Reservations",
      newReservation: "New Reservation",
      plate: "Vehicle Plate",
      passengers: "Number of Passengers",
      totalValue: "Total Value",
      makePayment: "Make Payment",
      status: "Status",
      pending: "Pending",
      paid: "Paid",
      cancelled: "Cancelled",
      noReservations: "No reservations found.",
      logout: "Logout",
    },
  },
  es: {
    // Landing Page
    home: {
      title: "Sistema de Gestión de",
      titleHighlight: "Reservas y Pagos",
      subtitle: "Control total de entradas, reservas y pagos en línea con tecnología de punta. Simplifique su gestión y ofrezca la mejor experiencia a sus clientes.",
      clientArea: "Área del Cliente",
      adminArea: "Área Administrativa",
      services: "Servicios",
      benefits: "Beneficios",
      contact: "Contacto",
      ourServices: "Nuestros Servicios",
      servicesDesc: "Ofrecemos soluciones completas para la gestión de reservas y pagos, con tecnología de punta y soporte especializado.",
      whyChoose: "¿Por Qué Elegir Dunar NexGen?",
      benefitsDesc: "Desarrollado con las mejores tecnologías del mercado para ofrecer rendimiento, seguridad y facilidad de uso.",
      contactUs: "Póngase en Contacto",
      contactDesc: "¿Tiene alguna pregunta o desea conocer mejor nuestras soluciones? Complete el formulario a continuación y nuestro equipo se pondrá en contacto.",
      fullName: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Teléfono",
      message: "Mensaje",
      sendMessage: "Enviar Mensaje",
      sending: "Enviando...",
      messageSent: "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.",
      address: "Dirección",
      businessHours: "Horario de Atención",
      mondayFriday: "Lunes a Viernes: 8h a 18h",
      saturday: "Sábado: 8h a 12h",
    },
    services: {
      onlinePayments: "Pagos en Línea",
      onlinePaymentsDesc: "Integración completa con Mercado Pago para procesar pagos de forma segura y rápida. Acepte tarjetas de crédito, débito y PIX.",
      reservationManagement: "Gestión de Reservas",
      reservationManagementDesc: "Control completo de reservas con estado en tiempo real, historial detallado y notificaciones automáticas para sus clientes.",
      accessControl: "Control de Acceso",
      accessControlDesc: "Sistema de control de entradas con validación de tickets, liberación manual e informes completos de movimiento.",
      reportsAnalytics: "Informes y Análisis",
      reportsAnalyticsDesc: "Paneles intuitivos con métricas en tiempo real, gráficos de rendimiento e informes personalizados para la toma de decisiones.",
      clientPortal: "Portal del Cliente",
      clientPortalDesc: "Interfaz intuitiva para que sus clientes gestionen sus reservas, realicen pagos y sigan el historial de transacciones.",
      advancedSecurity: "Seguridad Avanzada",
      advancedSecurityDesc: "Autenticación de dos factores (2FA), cifrado de datos y protección contra fraudes para garantizar la seguridad total del sistema.",
    },
    benefits: {
      optimizedPerformance: "Rendimiento Optimizado",
      optimizedPerformanceDesc: "Sistema desarrollado con Next.js y React para garantizar velocidad de carga y experiencia fluida en cualquier dispositivo.",
      totalReliability: "Confiabilidad Total",
      totalReliabilityDesc: "Infraestructura robusta con respaldo automático, alta disponibilidad y soporte técnico especializado para garantizar operación continua.",
      fullyResponsive: "100% Responsivo",
      fullyResponsiveDesc: "Interfaz adaptada para todos los dispositivos: teléfonos inteligentes, tabletas y computadoras. Sus clientes pueden acceder desde cualquier lugar.",
      timeSavings: "Ahorro de Tiempo y Recursos",
      timeSavingsDesc: "Automatice procesos manuales, reduzca errores operacionales y libere a su equipo para enfocarse en lo que realmente importa: el servicio al cliente.",
    },
    // Client Area
    client: {
      login: "Iniciar Sesión",
      username: "Usuario",
      password: "Contraseña",
      rememberMe: "Recordar usuario y contraseña",
      noAccount: "No tengo una cuenta",
      register: "Registrarse",
      name: "Nombre",
      cpf: "CPF",
      cnpj: "CNPJ",
      documentType: "Tipo de Documento",
      individualPerson: "CPF (Persona Física)",
      legalPerson: "CNPJ (Persona Jurídica)",
      alreadyHaveAccount: "Ya tengo una cuenta",
      welcome: "Bienvenido",
      myReservations: "Mis Reservas",
      newReservation: "Nueva Reserva",
      plate: "Placa del Vehículo",
      passengers: "Número de Pasajeros",
      totalValue: "Valor Total",
      makePayment: "Realizar Pago",
      status: "Estado",
      pending: "Pendiente",
      paid: "Pagado",
      cancelled: "Cancelado",
      noReservations: "No se encontraron reservas.",
      logout: "Salir",
    },
  },
}
