import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { calculateContractStatus } from '@/lib/utils/contract-status'
import Link from 'next/link'
import { ArrowLeft, Edit, Calendar, DollarSign, FileText } from 'lucide-react'
import DeleteButton from './DeleteButton'

export const dynamic = 'force-dynamic'

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const { id } = await params
  const supabase = await createClient()

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (!user) {
    redirect('/dashboard')
  }

  // Get contract
  const { data: contract } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!contract) {
    redirect('/dashboard')
  }

  const status = calculateContractStatus(contract.end_date)
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    ending_soon: 'bg-orange-100 text-orange-800',
    expired: 'bg-red-100 text-red-800',
    renewed: 'bg-blue-100 text-blue-800',
  }

  // Get reminders
  const { data: reminders } = await supabase
    .from('reminders')
    .select('*')
    .eq('contract_id', contract.id)
    .order('reminder_date', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {contract.contract_title || contract.client_name}
                </h1>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${statusColors[status]}`}>
                  {status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 truncate">Client: {contract.client_name}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Edit contract">
                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <DeleteButton 
                contractId={contract.id} 
                contractName={contract.contract_title || contract.client_name}
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">Start Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatDate(contract.start_date)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">End Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatDate(contract.end_date)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Rate</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(Number(contract.rate), contract.rate_currency)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Payment Frequency</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {contract.payment_frequency.replace('-', ' ')}
              </p>
            </div>
          </div>

          {contract.renewal_date && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Renewal Date</h3>
              <p className="text-gray-900">{formatDate(contract.renewal_date)}</p>
            </div>
          )}

          {contract.payment_terms && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Terms</h3>
              <p className="text-gray-900">{contract.payment_terms}</p>
            </div>
          )}

          {contract.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{contract.notes}</p>
            </div>
          )}

          {contract.file_url && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contract File</h3>
              <a
                href={contract.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                {contract.file_name || 'View Contract'}
              </a>
            </div>
          )}

          {reminders && reminders.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Upcoming Reminders</h3>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      reminder.sent ? 'bg-gray-50' : 'bg-purple-50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {reminder.reminder_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Reminder
                      </p>
                      <p className="text-xs text-gray-600">{formatDate(reminder.reminder_date)}</p>
                    </div>
                    {reminder.sent ? (
                      <span className="text-xs text-green-600 font-medium">Sent</span>
                    ) : (
                      <span className="text-xs text-orange-600 font-medium">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

