"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface NavigationButtonsProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showBack?: boolean
  showForward?: boolean
  className?: string
}

export default function NavigationButtons({
  position = "top-left",
  showBack = true,
  showForward = true,
  className = "",
}: NavigationButtonsProps) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  useEffect(() => {
    // Verifica se há histórico disponível
    setCanGoBack(window.history.length > 1)
    
    // Listener para detectar mudanças no histórico
    const handlePopState = () => {
      setCanGoBack(window.history.length > 1)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleBack = () => {
    if (canGoBack) {
      router.back()
    }
  }

  const handleForward = () => {
    router.forward()
  }

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex gap-2 ${className}`}>
      {showBack && (
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className={`
            flex items-center justify-center
            w-10 h-10 sm:w-12 sm:h-12
            rounded-full
            bg-gray-800/80 backdrop-blur-sm
            border-2 border-gray-700
            shadow-lg
            transition-all duration-200
            hover:bg-gray-700/90 hover:border-gray-600 hover:shadow-xl
            active:scale-95
            disabled:opacity-30 disabled:cursor-not-allowed
            group
          `}
          aria-label="Voltar"
          title="Voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 text-white group-hover:text-primary transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}

      {showForward && (
        <button
          onClick={handleForward}
          className={`
            flex items-center justify-center
            w-10 h-10 sm:w-12 sm:h-12
            rounded-full
            bg-gray-800/80 backdrop-blur-sm
            border-2 border-gray-700
            shadow-lg
            transition-all duration-200
            hover:bg-gray-700/90 hover:border-gray-600 hover:shadow-xl
            active:scale-95
            group
          `}
          aria-label="Avançar"
          title="Avançar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 text-white group-hover:text-primary transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
