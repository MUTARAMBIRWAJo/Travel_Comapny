'use client'

import { convertCurrency, formatCurrency } from '@/lib/supabaseClient'
import { useState } from 'react'

interface PriceDisplayProps {
  priceUSD: number
  priceRWF?: number
  showAllCurrencies?: boolean
  className?: string
}

export function PriceDisplay({
  priceUSD,
  priceRWF,
  showAllCurrencies = false,
  className = ''
}: PriceDisplayProps) {
  const [showMore, setShowMore] = useState(false)

  const currencies = ['USD', 'RWF', 'EUR', 'GBP', 'KES']

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Primary Price */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">
          {formatCurrency(priceUSD, 'USD')}
        </span>
        {priceRWF && (
          <span className="text-sm text-muted-foreground">
            / {formatCurrency(priceRWF, 'RWF')}
          </span>
        )}
      </div>

      {/* Additional Currencies */}
      {showAllCurrencies && (
        <div className="space-y-1">
          {currencies.slice(2).map((currency) => {
            const converted = convertCurrency(priceUSD, 'USD', currency)
            return (
              <div key={currency} className="text-xs text-muted-foreground">
                {currency}: {formatCurrency(converted, currency)}
              </div>
            )
          })}
        </div>
      )}

      {/* Toggle Button */}
      {!showAllCurrencies && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs text-primary hover:underline"
        >
          {showMore ? 'Hide prices' : 'More prices'}
        </button>
      )}

      {showMore && !showAllCurrencies && (
        <div className="space-y-1 pt-2 border-t">
          {['EUR', 'GBP', 'KES', 'UGX', 'ZAR'].map((currency) => {
            const converted = convertCurrency(priceUSD, 'USD', currency)
            return (
              <div key={currency} className="text-xs text-muted-foreground">
                {currency}: {formatCurrency(converted, currency)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
