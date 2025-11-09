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
  today.setHours(0, 0, 0, 0) // Normalize to start of day
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0) // Normalize to start of day
  
  const daysUntilEnd = differenceInDays(end, today)
  
  // If contract expires in 7 days or less, create daily reminders
  if (daysUntilEnd <= 7 && daysUntilEnd >= 0) {
    // Create a reminder for each day from today until the end date (inclusive)
    for (let i = 0; i <= daysUntilEnd; i++) {
      const reminderDate = new Date(today)
      reminderDate.setDate(reminderDate.getDate() + i)
      dates.push(reminderDate)
    }
  } else if (daysUntilEnd > 7) {
    // For contracts expiring in more than 7 days, create reminders at 30, 15, and 7 days before
    const reminderDays = [30, 15, 7]
    
    reminderDays.forEach(days => {
      const reminderDate = new Date(end)
      reminderDate.setDate(reminderDate.getDate() - days)
      
      // Only add if the reminder date is in the future
      if (isAfter(reminderDate, today) || reminderDate.getTime() === today.getTime()) {
        dates.push(reminderDate)
      }
    })
  }
  // If daysUntilEnd < 0, contract is already expired, no reminders

  return {
    renewal: dates.length > 0,
    dates,
  }
}

