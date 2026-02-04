'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign, TrendingUp, RefreshCw, Save } from 'lucide-react'
import { EXCHANGE_RATES } from '@/lib/supabaseClient'

export default function CurrencyManagementPage() {
  const [rates, setRates] = useState<Record<string, number>>(EXCHANGE_RATES)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    // Fetch current rates from API
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/currency/rates')
        const data = await response.json()
        if (data.rates) {
          setRates(data.rates)
          setLastUpdated(data.lastUpdated || new Date().toLocaleString())
        }
      } catch (error) {
        console.log('[v0] Could not fetch rates from API:', error)
        setLastUpdated(new Date().toLocaleString())
      }
    }
    fetchRates()
  }, [])

  const handleRateChange = (currency: string, newRate: number) => {
    setRates(prev => ({
      ...prev,
      [currency]: newRate
    }))
    setSaved(false)
  }

  const handleSaveRates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/currency/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rates })
      })

      if (response.ok) {
        setSaved(true)
        setLastUpdated(new Date().toLocaleString())
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.log('[v0] Error saving rates:', error)
    } finally {
      setLoading(false)
    }
  }

  const currencies = Object.entries(rates).map(([code, rate]) => ({
    code,
    rate,
    symbol: { USD: '$', RWF: 'FRw', EUR: '€', GBP: '£', KES: 'KSh', UGX: 'USh', ZAR: 'R', TZS: 'TSh' }[code] || code
  }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Currency Exchange Rates</h2>
        <p className="text-muted-foreground">Manage and update exchange rates for all supported currencies</p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Exchange Rate Management
          </CardTitle>
          <CardDescription>
            Last updated: {lastUpdated || 'Never'}. All rates are relative to USD (1 USD = Rate)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Rates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currencies.map((currency) => (
          <Card key={currency.code}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-secondary" />
                {currency.code}
              </CardTitle>
              <CardDescription>{currency.symbol}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`rate-${currency.code}`}>Exchange Rate (to 1 USD)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id={`rate-${currency.code}`}
                    type="number"
                    step="0.01"
                    value={currency.rate}
                    onChange={(e) => handleRateChange(currency.code, parseFloat(e.target.value))}
                    className="flex-1"
                    placeholder="0.00"
                  />
                  <span className="text-muted-foreground pt-2">{currency.symbol}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  1 USD = {currency.rate.toFixed(2)} {currency.code}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          size="lg"
          className="btn-primary gap-2"
          onClick={handleSaveRates}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Exchange Rates
            </>
          )}
        </Button>

        {saved && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Rates saved successfully
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-amber-900 space-y-2">
          <p>• Update exchange rates to reflect current market values</p>
          <p>• Rates are used automatically in price conversion across the platform</p>
          <p>• All prices are displayed in the customer&apos;s selected currency</p>
          <p>• Changes take effect immediately after saving</p>
        </CardContent>
      </Card>
    </div>
  )
}
