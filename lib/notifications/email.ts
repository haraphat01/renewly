import { Resend } from 'resend'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

export async function sendContractReminderEmail(
  to: string,
  contractName: string,
  clientName: string,
  endDate: string,
  daysUntilEnd: number,
  type: 'renewal' | 'rate_increase' | 'payment_term'
) {
  const subject = `Reminder: ${contractName} ${type === 'renewal' ? 'Renewal' : type === 'rate_increase' ? 'Rate Increase' : 'Payment Term'} Due Soon`

  const daysMessage =
    daysUntilEnd < 0
      ? `ended ${Math.abs(daysUntilEnd)} day${Math.abs(daysUntilEnd) === 1 ? '' : 's'} ago`
      : daysUntilEnd === 0
      ? 'ending today'
      : `ending in ${daysUntilEnd} day${daysUntilEnd === 1 ? '' : 's'}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Dealping</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0;">Contract Reminder</h2>
          <p style="color: #4b5563; font-size: 16px;">
            This is a reminder that your contract with <strong>${clientName}</strong> is ${daysMessage}.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #111827;"><strong>Contract:</strong> ${contractName}</p>
            <p style="margin: 5px 0; color: #111827;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 5px 0; color: #111827;"><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <p style="color: #4b5563; font-size: 14px;">
            Don't miss out on renewing your contract or negotiating better terms. Take action now!
          </p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">View Contract</a>
          </div>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          This is an automated reminder from Dealping. You can manage your reminders in your dashboard.
        </p>
      </body>
    </html>
  `

  try {
    const resend = getResend()
    await resend.emails.send({
      from: 'Dealping <noreply@dealping.app>',
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

