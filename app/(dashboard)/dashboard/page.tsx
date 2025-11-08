import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, AlertCircle, CheckCircle2, Clock, DollarSign, FileText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { calculateContractStatus } from '@/lib/utils/contract-status'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = await createClient()

  // Get or create user in our database
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (!user) {
    // Create user if doesn't exist
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        email: '', // Will be updated from Clerk
      })
      .select()
      .single()
    user = newUser
  }

  // Get contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .order('end_date', { ascending: true })

  const activeContracts = contracts?.filter(c => c.status === 'active') || []
  const endingSoon = contracts?.filter(c => c.status === 'ending_soon') || []
  const expired = contracts?.filter(c => c.status === 'expired') || []

  const totalRevenue = contracts?.reduce((sum, c) => sum + Number(c.rate || 0), 0) || 0

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your contracts and track renewals</p>
        </div>
        <Link
          href="/dashboard/contracts/new"
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="whitespace-nowrap">New Contract</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Contracts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{contracts?.length || 0}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{activeContracts.length}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Ending Soon</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">{endingSoon.length}</p>
            </div>
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Contracts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {contracts && contracts.length > 0 ? (
            contracts.map((contract) => {
              const status = calculateContractStatus(contract.end_date)
              const statusColors = {
                active: 'bg-green-100 text-green-800',
                ending_soon: 'bg-orange-100 text-orange-800',
                expired: 'bg-red-100 text-red-800',
                renewed: 'bg-blue-100 text-blue-800',
              }

              return (
                <Link
                  key={contract.id}
                  href={`/dashboard/contracts/${contract.id}`}
                  className="block p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {contract.contract_title || contract.client_name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${statusColors[status]}`}>
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-1 truncate">Client: {contract.client_name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span>Rate: {formatCurrency(Number(contract.rate), contract.rate_currency)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Ends: {formatDate(contract.end_date)}</span>
                      </div>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="p-8 sm:p-12 text-center">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No contracts yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Get started by uploading your first contract</p>
              <Link
                href="/dashboard/contracts/new"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Upload Contract
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

