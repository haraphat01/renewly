'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Who uses Dealping?",
    answer: "Dealping is designed for independent professionals who manage client contracts. Our users include freelancers (writers, designers, developers), consultants, independent contractors, small business owners, and agencies managing multiple client contracts. If you're juggling multiple contracts and need to stay on top of renewals, rate increases, and payment terms, Dealping is perfect for you.",
  },
  {
    question: "What is Dealping?",
    answer: "Dealping is an AI-powered contract management platform designed for independent professionals. It helps you track contracts, get automated reminders before renewals, and never miss important contract dates or rate increases. Simply upload your contracts, and our AI extracts all the key information automatically.",
  },
  {
    question: "How does AI contract extraction work?",
    answer: "Simply upload your contract as a PDF or DOCX file. Our AI automatically extracts key information including client names, contract dates, rates, payment terms, and renewal dates, saving you time on manual data entry. You can review and edit the extracted information before saving.",
  },
  {
    question: "What types of reminders does Dealping send?",
    answer: "Dealping sends automated email reminders 30, 15, and 7 days before contract expiration. For Pro users, you also get daily reminders when contracts are less than 7 days from expiry, plus SMS notifications. This ensures you never miss an important renewal or rate increase opportunity.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! Dealping offers a free plan that allows you to manage one contract with email reminders. This is perfect for trying out the platform and seeing how it works. Pro plans start at $9/month or $90/year for unlimited contracts and additional features like SMS reminders, revenue analytics, and priority support.",
  },
  {
    question: "Can I use my own contracts?",
    answer: "Absolutely! You can upload any contract in PDF or DOCX format. Our AI will extract the key information, or you can manually enter contract details. Dealping works with contracts from any industry or client type.",
  },
  {
    question: "Do I need a legal background to use Dealping?",
    answer: "Not at all! Dealping is designed for non-lawyers. We provide professional contract templates to get you started, and the platform focuses on tracking and reminders rather than legal advice. If you need legal review, you can always consult with a lawyer, but Dealping helps you stay organized and never miss important dates.",
  },
  {
    question: "Is my contract data secure?",
    answer: "Yes, security is a top priority. All contracts are stored securely using industry-standard encryption. We use modern authentication, secure storage, and your data is only accessible to you. We never share your contract information with third parties.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="mb-20" aria-labelledby="faq-heading">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Dealping and who it's for
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                >
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <Link
            href="/sign-up"
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            Get started and see how Dealping works →
          </Link>
        </div>
      </div>
    </section>
  )
}

