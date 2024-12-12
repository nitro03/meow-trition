"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLanguage } from './language-context'
import Image from 'next/image'

interface NutrientContent {
  protein: number;
  fat: number;
  fiber: number;
  moisture: number;
  ash: number;
}

const translations = {
  en: {
    title: "Cat Food Nutrition Calculator",
    canWeight: "Can Weight (grams)",
    protein: "Protein",
    fat: "Fat",
    fiber: "Fiber",
    moisture: "Moisture",
    ash: "Ash",
    calculate: "Calculate",
    results: "Results (grams)",
    dryMatter: "Dry Matter Composition (%)",
    carbohydrates: "Carbohydrates",
    footer: "Made with 😺 for cat lovers everywhere!",
    footerNote: "Now with automatic carbohydrate calculation and dry matter analysis!",
    invalidInput: "Invalid input. Please enter a number between 0 and 100 with up to 2 decimal places.",
    totalPercentageError: "The sum of all percentages cannot exceed 100%.",
    zeroWeightError: "Can weight must be greater than 0.",
  },
  pl: {
    title: "Kalkulator Wartości Odżywczych Karmy dla Kota",
    canWeight: "Waga puszki (gramy)",
    protein: "Białko",
    fat: "Tłuszcz",
    fiber: "Włókna",
    moisture: "Wilgotność",
    ash: "Popiół",
    calculate: "Oblicz",
    results: "Wyniki (gramy)",
    dryMatter: "Skład Suchej Masy (%)",
    carbohydrates: "Węglowodany",
    footer: "Stworzone z 😺 dla miłośników kotów!",
    footerNote: "Teraz z automatycznym obliczaniem węglowodanów i analizą suchej masy!",
    invalidInput: "Nieprawidłowe dane. Proszę wprowadzić liczbę między 0 a 100 z maksymalnie 2 miejscami po przecinku.",
    totalPercentageError: "Suma wszystkich procentów nie może przekraczać 100%.",
    zeroWeightError: "Waga puszki musi być większa niż 0.",
  }
}

export default function CatFoodCalculator() {
  const { language } = useLanguage()
  const t = translations[language]

  const [canWeight, setCanWeight] = useState<number>(0)
  const [percentages, setPercentages] = useState<NutrientContent>({
    protein: 0,
    fat: 0,
    fiber: 0,
    moisture: 0,
    ash: 0,
  })
  const [results, setResults] = useState<NutrientContent & {carbohydrates: number} | null>(null)
  const [dryMatterResults, setDryMatterResults] = useState<Omit<NutrientContent, 'moisture'> & {carbohydrates: number} | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateAndSetPercentage = (name: keyof NutrientContent, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 100 || !/^\d+(\.\d{0,2})?$/.test(value)) {
      setError(t.invalidInput)
      return
    }
    
    const newPercentages = { ...percentages, [name]: numValue }
    const totalPercentage = Object.values(newPercentages).reduce((sum, val) => sum + val, 0)
    
    if (totalPercentage > 100) {
      setError(t.totalPercentageError)
      return
    }
    
    setError(null)
    setPercentages(newPercentages)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'canWeight') {
      const numValue = parseFloat(value)
      if (!isNaN(numValue) && numValue > 0) {
        setCanWeight(numValue)
        setError(null)
      } else {
        setError(t.zeroWeightError)
      }
    } else {
      validateAndSetPercentage(name as keyof NutrientContent, value)
    }
  }

  const calculateNutrients = () => {
    if (canWeight <= 0) {
      setError(t.zeroWeightError)
      return
    }

    const totalPercentage = Object.values(percentages).reduce((sum, val) => sum + val, 0)
    if (totalPercentage > 100) {
      setError(t.totalPercentageError)
      return
    }

    const calculatedResults: NutrientContent & { carbohydrates: number } = {
      protein: (canWeight * percentages.protein) / 100,
      fat: (canWeight * percentages.fat) / 100,
      fiber: (canWeight * percentages.fiber) / 100,
      moisture: (canWeight * percentages.moisture) / 100,
      ash: (canWeight * percentages.ash) / 100,
      carbohydrates: 0,
    }
    
    calculatedResults.carbohydrates = canWeight - (
      calculatedResults.protein +
      calculatedResults.fat +
      calculatedResults.fiber +
      calculatedResults.moisture +
      calculatedResults.ash
    )
    
    setResults(calculatedResults)

    const dryMatter = canWeight - calculatedResults.moisture
    const dryMatterPercentages: Omit<NutrientContent, 'moisture'> & { carbohydrates: number } = {
      protein: (calculatedResults.protein / dryMatter) * 100,
      fat: (calculatedResults.fat / dryMatter) * 100,
      fiber: (calculatedResults.fiber / dryMatter) * 100,
      ash: (calculatedResults.ash / dryMatter) * 100,
      carbohydrates: (calculatedResults.carbohydrates / dryMatter) * 100,
    }
    setDryMatterResults(dryMatterPercentages)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-orange-100 border-2 border-orange-300 shadow-lg">
      <CardHeader className="bg-orange-200 rounded-t-lg">
        <div className="flex items-center justify-center mb-2">
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt="Bengal Cat"
            width={60}
            height={60}
            className="rounded-full border-2 border-orange-500"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-orange-800 flex items-center justify-center">
          <span className="mr-2" aria-hidden="true">🐱</span>
          {t.title}
          <span className="ml-2" aria-hidden="true">🐾</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="canWeight" className="text-orange-700">{t.canWeight}</Label>
            <Input
              id="canWeight"
              name="canWeight"
              type="number"
              value={canWeight}
              onChange={handleInputChange}
              placeholder={t.canWeight}
              className="bg-orange-50 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
              min="0.01"
              step="0.01"
            />
          </div>
          {Object.keys(percentages).map((nutrient) => (
            <div key={nutrient}>
              <Label htmlFor={nutrient} className="text-orange-700">
                {t[nutrient as keyof typeof t]} (%)
              </Label>
              <Input
                id={nutrient}
                name={nutrient}
                type="number"
                value={percentages[nutrient as keyof NutrientContent]}
                onChange={handleInputChange}
                placeholder={`${t[nutrient as keyof typeof t]} (%)`}
                className="bg-orange-50 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            onClick={calculateNutrients} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!!error || canWeight <= 0}
          >
            {t.calculate}
          </Button>
        </div>
        {results && dryMatterResults && (
          <div className="mt-6 space-y-4">
            <div className="bg-orange-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-orange-800">{t.results}:</h3>
              <ul className="space-y-2">
                {Object.entries(results).map(([nutrient, value]) => (
                  <li key={nutrient} className="flex justify-between text-orange-700">
                    <span>{t[nutrient as keyof typeof t]}:</span>
                    <span>{value.toFixed(2)}g</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-orange-800">{t.dryMatter}:</h3>
              <ul className="space-y-2">
                {Object.entries(dryMatterResults).map(([nutrient, value]) => (
                  <li key={nutrient} className="flex justify-between text-orange-700">
                    <span>{t[nutrient as keyof typeof t]}:</span>
                    <span>{value.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

