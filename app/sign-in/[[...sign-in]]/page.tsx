import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Dealping</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your contracts</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <SignIn 
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                footerActionLink: "text-purple-600 hover:text-purple-700",
              }
            }}
          />
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

