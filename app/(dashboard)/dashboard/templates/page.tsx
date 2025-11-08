'use client'

import { FileText, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const templates = [
  {
    id: 'freelance-writing',
    name: 'Freelance Writing Contract',
    category: 'Writing',
    description: 'Standard contract for freelance writers covering deliverables, payment terms, and copyright.',
  },
  {
    id: 'web-design',
    name: 'Web Design Contract',
    category: 'Design',
    description: 'Comprehensive contract for web designers including project scope, revisions, and ownership.',
  },
  {
    id: 'software-development',
    name: 'Software Development Contract',
    category: 'Development',
    description: 'Contract template for software developers covering milestones, IP rights, and maintenance.',
  },
  {
    id: 'consulting',
    name: 'Consulting Services Agreement',
    category: 'Consulting',
    description: 'Professional consulting agreement with terms for deliverables, confidentiality, and payment.',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design Contract',
    category: 'Design',
    description: 'Contract for graphic designers covering project scope, revisions, and usage rights.',
  },
  {
    id: 'marketing',
    name: 'Marketing Services Contract',
    category: 'Marketing',
    description: 'Agreement for marketing freelancers including campaign scope, reporting, and payment terms.',
  },
]

export default function TemplatesPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (templateId: string) => {
    setDownloading(templateId)
    try {
      const response = await fetch(`/api/templates/${templateId}/download`)
      
      if (!response.ok) {
        throw new Error('Failed to download template')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `${templateId}.docx`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download template. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contract Templates</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Professional contract templates for your freelance business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                {template.category}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{template.description}</p>
            <button
              onClick={() => handleDownload(template.id)}
              disabled={downloading === template.id}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {downloading === template.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Template
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-purple-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Need a Custom Template?</h2>
        <p className="text-gray-600 mb-6">
          We're constantly adding new templates. Have a suggestion? Let us know!
        </p>
        <a
                href="mailto:support@dealping.app"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  )
}

