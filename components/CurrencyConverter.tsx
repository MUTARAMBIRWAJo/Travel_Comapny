'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { convertCurrency, formatCurrency, EXCHANGE_RATES } from '@/lib/supabaseClient'
import { ArrowRightLeft } from 'lucide-react'

export function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100)
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('RWF')

  const currencies = Object.keys(EXCHANGE_RATES)
  const result = useMemo(() => convertCurrency(amount, fromCurrency, toCurrency), [amount, fromCurrency, toCurrency])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert travel prices to your preferred currency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <div className="flex gap-2">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount"
              className="w-32"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSwap}
            variant="outline"
            size="sm"
            className="rounded-full bg-transparent"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex gap-2">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
            <div className="w-32 rounded-md border border-input bg-muted px-3 py-2 flex items-center">
              <span className="font-medium">{formatCurrency(result, toCurrency)}</span>
            </div>
          </div>
        </div>

        {/* Rate Info */}
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          <p>
            1 {fromCurrency} = {formatCurrency(convertCurrency(1, fromCurrency, toCurrency), toCurrency)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
