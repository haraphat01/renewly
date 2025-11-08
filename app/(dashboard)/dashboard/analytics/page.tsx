import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

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

  // Get all contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .order('end_date', { ascending: true })

  // Calculate analytics
  const totalRevenue = contracts?.reduce((sum, c) => sum + Number(c.rate || 0), 0) || 0
  const activeContracts = contracts?.filter(c => c.status === 'active').length || 0
  const endingSoon = contracts?.filter(c => c.status === 'ending_soon').length || 0
  const expired = contracts?.filter(c => c.status === 'expired').length || 0

  // Calculate average rate
  const averageRate = contracts && contracts.length > 0
    ? totalRevenue / contracts.length
    : 0

  // Group by client
  const clients = contracts?.reduce((acc: any, contract) => {
    if (!acc[contract.client_name]) {
      acc[contract.client_name] = {
        name: contract.client_name,
        contracts: 0,
        totalRevenue: 0,
      }
    }
    acc[contract.client_name].contracts++
    acc[contract.client_name].totalRevenue += Number(contract.rate || 0)
    return acc
  }, {}) || {}

  const clientList = Object.values(clients).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)

  // Contracts expiring this month
  const now = new Date()
  const thisMonth = contracts?.filter(c => {
    const endDate = new Date(c.end_date)
    return endDate.getMonth() === now.getMonth() && endDate.getFullYear() === now.getFullYear()
  }) || []

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Track your revenue and contract performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Average Rate</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{formatCurrency(averageRate)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Active Clients</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{Object.keys(clients).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Expiring This Month</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{thisMonth.length}</p>
        </div>
      </div>

      {/* Client Revenue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Revenue by Client</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {clientList.length > 0 ? (
            clientList.map((client: any) => (
              <div key={client.name} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.contracts} contract{client.contracts !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(client.totalRevenue)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              No client data available
            </div>
          )}
        </div>
      </div>

      {/* Contracts Expiring This Month */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Expiring This Month</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {thisMonth.length > 0 ? (
            thisMonth.map((contract) => (
              <div key={contract.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contract.contract_title || contract.client_name}
                    </h3>
                    <p className="text-sm text-gray-600">{contract.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Ends: {formatDate(contract.end_date)}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatCurrency(Number(contract.rate), contract.rate_currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              No contracts expiring this month
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

