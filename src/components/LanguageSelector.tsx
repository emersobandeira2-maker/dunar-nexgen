"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2 items-center bg-background-strong-muted rounded-lg p-1 border border-gray-700">
      <button
        onClick={() => setLanguage("pt")}
        className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
          language === "pt"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-white"
        }`}
        title="Português"
      >
        🇧🇷 PT
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
          language === "en"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-white"
        }`}
        title="English"
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => setLanguage("es")}
        className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
          language === "es"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-white"
        }`}
        title="Español"
      >
        🇪🇸 ES
      </button>
    </div>
  )
}
