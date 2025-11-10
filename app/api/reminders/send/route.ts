import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendContractReminderEmail } from '@/lib/notifications/email'
import { differenceInDays } from 'date-fns'

async function authorize(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronHeader = request.headers.get('x-vercel-cron')

  const hasSecret = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isVercelCron = Boolean(cronHeader)

  if (!hasSecret && !isVercelCron) {
    return false
  }

  return true
}

async function processReminders() {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data: reminders, error: remindersError } = await supabase
      .from('reminders')
      .select(`
        *,
        contracts (
          id,
          client_name,
          contract_title,
          end_date,
          user_id
        ),
        users (
          id,
          email
        )
      `)
      .lte('reminder_date', today)
      .eq('sent', false)

    if (remindersError) {
      console.error('Error fetching reminders:', remindersError)
      return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 })
    }

    if (!reminders || reminders.length === 0) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    let sentCount = 0

    for (const reminder of reminders) {
      const contract = reminder.contracts as any
      const user = reminder.users as any

      if (!contract || !user || !user.email) {
        continue
      }

      const daysUntilEnd = differenceInDays(new Date(contract.end_date), new Date())

      try {
        await sendContractReminderEmail(
          user.email,
          contract.contract_title || contract.client_name,
          contract.client_name,
          contract.end_date,
          daysUntilEnd,
          reminder.reminder_type
        )

        await supabase
          .from('reminders')
          .update({
            sent: true,
            sent_at: new Date().toISOString(),
          })
          .eq('id', reminder.id)

        sentCount++
      } catch (error) {
        console.error(`Error sending reminder ${reminder.id}:`, error)
      }
    }

    return NextResponse.json({ success: true, sent: sentCount })
  } catch (error: any) {
    console.error('Reminder sending error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// This endpoint should be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  const authorized = await authorize(request)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return processReminders()
}

export async function GET(request: NextRequest) {
  const authorized = await authorize(request)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return processReminders()
}

