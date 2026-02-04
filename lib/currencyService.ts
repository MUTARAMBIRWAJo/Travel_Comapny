// Currency Conversion Service
// Supports RWF, USD, EUR, GBP, etc.

export type Currency = "RWF" | "USD" | "EUR" | "GBP" | "CHF" | "JPY" | "AUD" | "CAD"

// Exchange rates (base: RWF) - Updated daily
const EXCHANGE_RATES: Record<Currency, number> = {
  RWF: 1,
  USD: 0.00078, // 1 USD = ~1280 RWF (approximate)
  EUR: 0.00085, // 1 EUR = ~1180 RWF (approximate)
  GBP: 0.00098, // 1 GBP = ~1020 RWF (approximate)
  CHF: 0.00087, // 1 CHF = ~1150 RWF (approximate)
  JPY: 0.11, // 1 JPY = ~9 RWF (approximate)
  AUD: 0.0012, // 1 AUD = ~833 RWF (approximate)
  CAD: 0.0011, // 1 CAD = ~909 RWF (approximate)
}

export interface ConversionResult {
  originalAmount: number
  originalCurrency: Currency
  convertedAmount: number
  convertedCurrency: Currency
  rate: number
  timestamp: Date
}

/**
 * Convert amount from one currency to another
 * All conversions go through RWF as the base currency
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): ConversionResult {
  if (fromCurrency === toCurrency) {
    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: amount,
      convertedCurrency: toCurrency,
      rate: 1,
      timestamp: new Date(),
    }
  }

  // Convert to RWF first
  const toRWF = amount / (EXCHANGE_RATES[fromCurrency] || 1)

  // Then convert from RWF to target currency
  const converted = toRWF * (EXCHANGE_RATES[toCurrency] || 1)

  // Calculate the effective rate
  const rate = (EXCHANGE_RATES[toCurrency] || 1) / (EXCHANGE_RATES[fromCurrency] || 1)

  return {
    originalAmount: amount,
    originalCurrency: fromCurrency,
    convertedAmount: Math.round(converted * 100) / 100,
    convertedCurrency: toCurrency,
    rate: Math.round(rate * 10000) / 10000,
    timestamp: new Date(),
  }
}

/**
 * Format currency value for display
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    RWF: "₨",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CHF: "CHF",
    JPY: "¥",
    AUD: "$",
    CAD: "$",
  }

  const formatter = new Intl.NumberFormat(
    currency === "RWF" ? "rw-RW" : currency === "USD" ? "en-US" : "en-GB",
    {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }
  )

  return formatter.format(amount)
}

/**
 * Get conversion rate between two currencies
 */
export function getExchangeRate(fromCurrency: Currency, toCurrency: Currency): number {
  if (fromCurrency === toCurrency) return 1
  return (EXCHANGE_RATES[toCurrency] || 1) / (EXCHANGE_RATES[fromCurrency] || 1)
}

/**
 * List all supported currencies
 */
export function getSupportedCurrencies(): Currency[] {
  return Object.keys(EXCHANGE_RATES) as Currency[]
}
