'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FileText, LayoutDashboard, Upload, BarChart3, Settings, Menu, X, Crown, Sparkles } from 'lucide-react'
import UserProfileButton from './UserProfileButton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(() => {
      setIsLoaded(true)
      // Fetch user subscription plan
      fetch('/api/user/subscription')
        .then(res => res.json())
        .then(data => {
          if (data.plan) {
            setPlan(data.plan)
          }
        })
        .catch(() => {})
    })
  }, [])

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/contracts/new', icon: Upload, label: 'New Contract' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/templates', icon: FileText, label: 'Templates' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center">
            <FileText className="h-6 w-6 text-purple-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Dealping</span>
          </Link>
          <div className="flex items-center gap-3">
            {plan === 'free' && (
              <Link
                href="/dashboard/upgrade"
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Upgrade</span>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 lg:border-b-0">
            <Link href="/dashboard" className="flex items-center mb-8" onClick={() => setSidebarOpen(false)}>
              <FileText className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Dealping</span>
            </Link>
            
            {/* Upgrade Banner */}
            {plan === 'free' && (
              <Link
                href="/dashboard/upgrade"
                onClick={() => setSidebarOpen(false)}
                className="mb-6 flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
              >
                <Crown className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">Upgrade to Pro</p>
                  <p className="text-xs opacity-90">Unlock unlimited contracts & more</p>
                </div>
                <Sparkles className="h-4 w-4" />
              </Link>
            )}

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  plan === 'free' ? 'bg-gray-100 text-gray-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {plan === 'free' ? 'Free' : 'Pro'}
                </div>
              </div>
            </div>
            <UserProfileButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
