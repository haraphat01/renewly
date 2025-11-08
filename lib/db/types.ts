export type ContractStatus = 'active' | 'ending_soon' | 'expired' | 'renewed'

export interface Contract {
  id: string
  user_id: string
  client_name: string
  contract_title?: string
  start_date: string
  end_date: string
  renewal_date?: string
  rate: number
  rate_currency: string
  payment_terms: string
  payment_frequency: 'one-time' | 'monthly' | 'quarterly' | 'yearly'
  status: ContractStatus
  file_url?: string
  file_name?: string
  extracted_data?: Record<string, any>
  notes?: string
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  contract_id: string
  user_id: string
  reminder_type: 'renewal' | 'rate_increase' | 'payment_term'
  reminder_date: string
  sent: boolean
  sent_at?: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'pro'
  stripe_subscription_id?: string
  stripe_customer_id?: string
  status: 'active' | 'canceled' | 'past_due'
  current_period_end?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  phone_number?: string
  sms_enabled: boolean
  created_at: string
  updated_at: string
}

