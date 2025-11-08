import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateContractStatus, shouldCreateReminders } from '@/lib/utils/contract-status'
import { canCreateContract } from '@/lib/utils/subscription'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get or create user
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (!user) {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          email: '',
        })
        .select()
        .single()

      if (userError) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      user = newUser
    }

    // Check subscription limits
    const canCreate = await canCreateContract(user.id)
    if (!canCreate.allowed) {
      return NextResponse.json({ error: canCreate.reason }, { status: 403 })
    }

    const body = await request.json()
    const {
      client_name,
      contract_title,
      start_date,
      end_date,
      renewal_date,
      rate,
      rate_currency,
      payment_terms,
      payment_frequency,
      notes,
    } = body

    // Validate required fields
    if (!client_name || !start_date || !end_date || !rate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate status
    const status = calculateContractStatus(end_date)

    // Create contract
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        client_name,
        contract_title: contract_title || null,
        start_date,
        end_date,
        renewal_date: renewal_date || null,
        rate: parseFloat(rate),
        rate_currency: rate_currency || 'USD',
        payment_terms: payment_terms || null,
        payment_frequency: payment_frequency || 'monthly',
        status,
        notes: notes || null,
      })
      .select()
      .single()

    if (contractError) {
      console.error('Contract creation error:', contractError)
      return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
    }

    // Create reminders
    const reminders = shouldCreateReminders(end_date, renewal_date)
    if (reminders.renewal && reminders.dates.length > 0) {
      const reminderInserts = reminders.dates.map(date => ({
        contract_id: contract.id,
        user_id: user.id,
        reminder_type: 'renewal' as const,
        reminder_date: date.toISOString().split('T')[0],
      }))

      await supabase.from('reminders').insert(reminderInserts)
    }

    return NextResponse.json({ success: true, contract })
  } catch (error: any) {
    console.error('Contract creation error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

