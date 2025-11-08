'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'

export default function NewContractPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [manualMode, setManualMode] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    contract_title: '',
    start_date: '',
    end_date: '',
    renewal_date: '',
    rate: '',
    rate_currency: 'USD',
    payment_terms: '',
    payment_frequency: 'monthly',
    notes: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (manualMode) {
        // Manual entry
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create contract')
        }

        router.push('/dashboard')
      } else {
        // File upload
        if (!file) {
          throw new Error('Please select a file')
        }

        const formDataToSend = new FormData()
        formDataToSend.append('file', file)

        const response = await fetch('/api/contracts/upload', {
          method: 'POST',
          body: formDataToSend,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to upload contract')
        }

        const result = await response.json()
        
        // If extraction was successful, show the extracted data for review
        if (result.contract) {
          router.push(`/dashboard/contracts/${result.contract.id}/review`)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Contract</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Upload a contract file or enter details manually</p>
      </div>

      {/* Toggle between upload and manual */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setManualMode(false)}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
              !manualMode
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2" />
            <span className="block sm:inline">Upload File (AI Extraction)</span>
          </button>
          <button
            type="button"
            onClick={() => setManualMode(true)}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
              manualMode
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2" />
            <span className="block sm:inline">Manual Entry</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        {!manualMode ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Contract (PDF or DOCX)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div>
                    <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">PDF or DOCX (max 10MB)</p>
                  </div>
                )}
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Our AI will automatically extract contract details including dates, rates, and terms.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Title
                </label>
                <input
                  type="text"
                  value={formData.contract_title}
                  onChange={(e) => setFormData({ ...formData, contract_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewal Date
                </label>
                <input
                  type="date"
                  value={formData.renewal_date}
                  onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate *
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.rate_currency}
                    onChange={(e) => setFormData({ ...formData, rate_currency: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Frequency *
                </label>
                <select
                  required
                  value={formData.payment_frequency}
                  onChange={(e) => setFormData({ ...formData, payment_frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <input
                type="text"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Net 30, Due on receipt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Any additional notes about this contract..."
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Create Contract'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

