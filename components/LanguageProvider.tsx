"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Language } from "@/lib/i18n"
import { translate } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'rw')) return saved
    const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en'
    if (browserLang === 'fr') return 'fr'
    if (browserLang === 'rw') return 'rw'
    return 'en'
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: (key: string) => translate(key, language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
