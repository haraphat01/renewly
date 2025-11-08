import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendContractReminderEmail } from '@/lib/notifications/email'
import { differenceInDays } from 'date-fns'

// This endpoint should be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized request (you should add API key auth here)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Get all unsent reminders for today
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
      .eq('reminder_date', today)
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

        // Mark reminder as sent
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

