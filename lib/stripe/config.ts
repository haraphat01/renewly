import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

export const STRIPE_PLANS = {
  pro: {
    monthly: {
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      amount: 9,
      interval: 'month' as const,
    },
    yearly: {
      priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
      amount: 90,
      interval: 'year' as const,
    },
    name: 'Pro',
  },
}

export type StripePlan = keyof typeof STRIPE_PLANS
export type BillingInterval = 'month' | 'year'

