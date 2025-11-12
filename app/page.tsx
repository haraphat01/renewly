import Link from "next/link";
import { Suspense } from "react";
import { Check, Upload, Bell, TrendingUp, FileText, Users, Briefcase, Building2, UserCheck, Sparkles } from "lucide-react";
import PricingSection from "./components/PricingSection";
import AuthButtons from "./components/AuthButtons";
import OAuthCallbackHandler from "./components/OAuthCallbackHandler";
import StructuredData from "./components/StructuredData";

export const metadata = {
  title: "AI-Powered Contract Management for Independent Professionals",
  description: "Never miss a contract renewal again. Dealping uses AI to extract contract details, sends automated reminders, and helps freelancers, consultants, and small businesses track all their contracts in one place. Start free today.",
  openGraph: {
    title: "Dealping - Never Miss a Contract Renewal",
    description: "AI-powered contract management for independent professionals. Track contracts, get automated reminders, and protect your income.",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <Suspense fallback={null}>
        <OAuthCallbackHandler />
      </Suspense>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Navigation */}
        <header>
          <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center" aria-label="Dealping Home">
                  <FileText className="h-8 w-8 text-purple-600" aria-hidden="true" />
                  <span className="ml-2 text-2xl font-bold text-gray-900">Dealping</span>
                </Link>
                <AuthButtons />
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Never miss a renewal, rate increase, or payment term again
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered contract management for independent professionals. Track contracts, get automated reminders, and protect your income.
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

          {/* Video Demo Section */}
          <div className="mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">See Dealping in Action</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Watch how easy it is to manage your contracts and never miss a renewal
                </p>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/jfzbRRNN-lk?si=DNGpmv1L0nOhRpIF"
                  title="Dealping Demo Video - See how to manage contracts and never miss a renewal"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        {/* Who It's For */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Built for Independent Professionals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a solo freelancer or managing a growing agency, Dealping helps you stay on top of every contract
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Freelancers</h3>
              <p className="text-sm text-gray-600">Manage client contracts and never miss a renewal</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultants</h3>
              <p className="text-sm text-gray-600">Track project agreements and payment terms</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Independent Contractors</h3>
              <p className="text-sm text-gray-600">Keep track of all your service agreements</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Business Owners</h3>
              <p className="text-sm text-gray-600">Organize vendor and client contracts in one place</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agencies</h3>
              <p className="text-sm text-gray-600">Manage multiple client contracts efficiently</p>
            </div>
          </div>
        </div>

          {/* Features Grid */}
          <section id="features" aria-labelledby="features-heading" className="mb-20">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 text-center mb-12">Powerful Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Upload className="h-10 w-10 text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Contract Extraction</h3>
              <p className="text-gray-600">Upload PDFs or DOCX files. Our AI automatically extracts dates, rates, and terms.</p>
            </article>
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Bell className="h-10 w-10 text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Reminders</h3>
              <p className="text-gray-600">Get email and SMS reminders 30, 15, and 7 days before renewals.</p>
            </article>
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <TrendingUp className="h-10 w-10 text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Tracking</h3>
              <p className="text-gray-600">Track total revenue, expiring contracts, and average rates per client.</p>
            </article>
            <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <FileText className="h-10 w-10 text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contract Templates</h3>
              <p className="text-gray-600">Access professional contract templates for writing, design, dev, and more.</p>
            </article>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-2xl shadow-lg p-12 mb-20" aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
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
          </section>

          {/* Pricing */}
          <PricingSection />

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to protect your income?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of independent professionals who never miss a renewal.</p>
            <Link href="/sign-up" className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block">
              Start Free Trial
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link href="/" className="flex items-center mb-4 md:mb-0" aria-label="Dealping Home">
                <FileText className="h-6 w-6 text-purple-600" aria-hidden="true" />
                <span className="ml-2 text-xl font-bold text-gray-900">Dealping</span>
              </Link>
              <p className="text-gray-600 text-sm">© 2025 Dealping. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
