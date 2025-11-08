import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Check, Upload, Bell, TrendingUp, FileText } from "lucide-react";

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
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                  <button className="text-gray-700 hover:text-gray-900 px-4 py-2">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-4 py-2">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
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
            <SignedOut>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                  Start Free Trial
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg inline-block">
                Go to Dashboard
              </Link>
            </SignedIn>
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
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  1 active contract
                </li>
                <li className="flex items-center text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Email reminders
                </li>
                <li className="flex items-center text-gray-400">
                  <Check className="h-5 w-5 text-gray-300 mr-2" />
                  SMS reminders
                </li>
                <li className="flex items-center text-gray-400">
                  <Check className="h-5 w-5 text-gray-300 mr-2" />
                  Analytics
                </li>
              </ul>
              <SignedOut>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                  <button className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-white transform scale-105">
              <div className="bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$9<span className="text-lg opacity-90">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Unlimited contracts
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Email + SMS reminders
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Revenue analytics
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Priority support
                </li>
              </ul>
              <SignedOut>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                  <button className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Start Pro Trial
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to protect your freelance income?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of freelancers who never miss a renewal.</p>
          <SignedOut>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Start Free Trial
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block">
              Go to Dashboard
            </Link>
          </SignedIn>
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
            <p className="text-gray-600 text-sm">© 2024 Dealping. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
