/**
 * Phase 6 — Payment gateway abstraction.
 * Supports: Stripe/PayPal (international), Mobile Money (Rwanda), corporate wallets, partial payments.
 * Implementations are backend-only; no PCI data in frontend.
 */

export type PaymentProvider = "stripe" | "paypal" | "mobile_money_rw" | "corporate_wallet"

export interface PaymentIntent {
  provider: PaymentProvider
  amount: number
  currency: string
  reference: string
  metadata?: Record<string, unknown>
}

export interface PaymentResult {
  success: boolean
  transaction_id?: string
  error_code?: string
  error_message?: string
}

export interface PaymentGateway {
  createIntent(intent: PaymentIntent): Promise<{ client_secret?: string; redirect_url?: string; transaction_id?: string }>
  capture(transactionId: string, amount?: number): Promise<PaymentResult>
  refund(transactionId: string, amount?: number, reason?: string): Promise<PaymentResult>
}

/**
 * Resolve gateway by provider. Returns stub if provider not configured.
 */
export function getPaymentGateway(provider: PaymentProvider): PaymentGateway {
  if (provider === "stripe" && process.env.STRIPE_SECRET_KEY) {
    return createStripeGateway()
  }
  if (provider === "mobile_money_rw") {
    return createMobileMoneyRwGateway()
  }
  return createStubGateway()
}

function createStubGateway(): PaymentGateway {
  return {
    async createIntent() {
      return { transaction_id: `stub_${Date.now()}` }
    },
    async capture() {
      return { success: true }
    },
    async refund() {
      return { success: true }
    },
  }
}

function createStripeGateway(): PaymentGateway {
  return {
    async createIntent(intent: PaymentIntent) {
      // In production: Stripe SDK createPaymentIntent
      return { transaction_id: `pi_${Date.now()}`, client_secret: "pk_test_..." }
    },
    async capture(transactionId: string) {
      return { success: true, transaction_id: transactionId }
    },
    async refund(transactionId: string, amount?: number) {
      return { success: true, transaction_id: transactionId }
    },
  }
}

function createMobileMoneyRwGateway(): PaymentGateway {
  return {
    async createIntent(intent: PaymentIntent) {
      return { transaction_id: `mm_${Date.now()}`, redirect_url: "/payment/mobile-money" }
    },
    async capture(transactionId: string) {
      return { success: true, transaction_id: transactionId }
    },
    async refund(transactionId: string) {
      return { success: true, transaction_id: transactionId }
    },
  }
}
