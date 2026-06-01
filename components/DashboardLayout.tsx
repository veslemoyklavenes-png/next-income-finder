'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DashboardLayoutProps {
  children: React.ReactNode
  usageCount: number
  currentPage: 'dashboard' | 'tool'
}

export default function DashboardLayout({
  children,
  usageCount,
  currentPage,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navLinks = [
    { href: '/dashboard', label: 'Home', key: 'dashboard' },
    { href: '/tool', label: 'Tool', key: 'tool' },
  ]

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-[240px] bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-30">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="font-lora font-bold text-[18px] text-navy leading-tight">
            Next Income Finder
          </h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentPage === link.key
                  ? 'bg-[#F0F5F0] text-[#5A7A5C] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.key === 'dashboard' ? (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5h-6V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              )}
              {link.label}
              {currentPage === link.key && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7D9B7F]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom: usage + sign out */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between bg-[#F7F8FA] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-500">Used today</span>
            <span className={`text-xs font-semibold ${usageCount >= 18 ? 'text-red-500' : 'text-[#5A7A5C]'}`}>
              {usageCount} / 20
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <span className="font-lora font-bold text-[16px] text-navy">
          Next Income Finder
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">
            {usageCount}/20
          </span>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      <div
        className={`md:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-gray-100 overflow-hidden transition-all duration-200 ease-in-out ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                currentPage === link.key
                  ? 'bg-[#F0F5F0] text-[#5A7A5C]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full text-left flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </nav>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-[240px] pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
