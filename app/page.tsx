import Link from "next/link";
import { Check, Upload, Bell, TrendingUp, FileText } from "lucide-react";
import PricingSection from "./components/PricingSection";
import AuthButtons from "./components/AuthButtons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Dealping</span>
            </div>
            <AuthButtons />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Never miss a renewal, rate increase, or payment term again
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered contract reminders for freelancers. Track contracts, get automated reminders, and protect your income.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg inline-block text-center">
              Start Free Trial
            </Link>
            <a href="#features" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors">
              Learn More
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Upload className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Contract Extraction</h3>
            <p className="text-gray-600">Upload PDFs or DOCX files. Our AI automatically extracts dates, rates, and terms.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Bell className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Reminders</h3>
            <p className="text-gray-600">Get email and SMS reminders 30, 15, and 7 days before renewals.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <TrendingUp className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Tracking</h3>
            <p className="text-gray-600">Track total revenue, expiring contracts, and average rates per client.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contract Templates</h3>
            <p className="text-gray-600">Access professional contract templates for writing, design, dev, and more.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Contract</h3>
              <p className="text-gray-600">Upload a PDF or DOCX file, or paste contract text. Our AI extracts all key information automatically.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track & Monitor</h3>
              <p className="text-gray-600">View all your contracts in one dashboard. See which ones are ending soon or need attention.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Reminded</h3>
              <p className="text-gray-600">Receive automated email and SMS reminders before renewals, so you never miss an opportunity.</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <PricingSection />

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to protect your freelance income?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of freelancers who never miss a renewal.</p>
          <Link href="/sign-up" className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block">
            Start Free Trial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Dealping</span>
            </div>
            <p className="text-gray-600 text-sm">© 2025 Dealping. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
