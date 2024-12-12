"use client"

import CatFoodCalculator from '../components/cat-food-calculator'
import { LanguageProvider, useLanguage } from '@/components/language-context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'

const translations = {
  en: {
    title: "Meow-trition Calculator",
    footer: "Made with 😺 for cat lovers everywhere!",
    footerNote: "Now with automatic carbohydrate calculation and dry matter analysis!",
    language: "Language",
  },
  pl: {
    title: "Kalkulator Meow-trition",
    footer: "Stworzone z 😺 dla miłośników kotów!",
    footerNote: "Teraz z automatycznym obliczaniem węglowodanów i analizą suchej masy!",
    language: "Język",
  }
}

function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <Select value={language} onValueChange={(value: 'en' | 'pl') => setLanguage(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={translations[language].language} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="pl">Polski</SelectItem>
      </SelectContent>
    </Select>
  )
}

function Home() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <main className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-orange-100 to-orange-200">
      <div className="flex justify-end mb-4">
        <LanguageSelector />
      </div>
      <div className="flex flex-col items-center justify-center mb-6">
        <Image
          src="/placeholder.svg?height=80&width=80"
          alt="Bengal Cat"
          width={80}
          height={80}
          className="rounded-full border-2 border-orange-500 mb-2"
        />
        <h1 className="text-4xl font-bold text-center text-orange-800 flex items-center justify-center">
          <span className="mr-2" aria-hidden="true">🐱</span>
          {t.title}
          <span className="ml-2" aria-hidden="true">🐾</span>
        </h1>
      </div>
      <CatFoodCalculator />
      <footer className="mt-8 text-center text-orange-700">
        <p>{t.footer}</p>
        <p className="mt-2">{t.footerNote}</p>
      </footer>
    </main>
  )
}

export default function WrappedHome() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  )
}

