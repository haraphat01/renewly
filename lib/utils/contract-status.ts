import { ContractStatus } from '@/lib/db/types'
import { differenceInDays, isAfter, isBefore } from 'date-fns'

export function calculateContractStatus(endDate: string): ContractStatus {
  const today = new Date()
  const end = new Date(endDate)
  const daysUntilEnd = differenceInDays(end, today)

  if (isBefore(end, today)) {
    return 'expired'
  } else if (daysUntilEnd <= 30) {
    return 'ending_soon'
  } else {
    return 'active'
  }
}

export function shouldCreateReminders(endDate: string, renewalDate?: string): {
  renewal: boolean
  dates: Date[]
} {
  const dates: Date[] = []
  const today = new Date()
  const end = new Date(endDate)
  
  // Create reminders at 30, 15, and 7 days before end date
  const reminderDays = [30, 15, 7]
  
  reminderDays.forEach(days => {
    const reminderDate = new Date(end)
    reminderDate.setDate(reminderDate.getDate() - days)
    
    if (isAfter(reminderDate, today)) {
      dates.push(reminderDate)
    }
  })

  return {
    renewal: dates.length > 0,
    dates,
  }
}

