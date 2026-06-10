'use client'

import Link from 'next/link'

const BUY_URL = 'https://buy.stripe.com/00w00kcSG3Saa759cBfjG02'
const SAGE = '#7D9B7F'
const NAVY = '#1B3A5C'

export default function PaywallPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ backgroundColor: '#f5f0eb' }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#F0F5F0' }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={SAGE} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h1 className="font-lora font-bold text-[24px] mb-3" style={{ color: NAVY }}>
          Next Income Finder
        </h1>

        <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
          To access your ranked income plan, you need to purchase Next Income Finder first.
          One-time payment. Instant access.
        </p>

        <a
          href={BUY_URL}
          className="block w-full py-4 rounded-xl font-bold text-white text-[16px] mb-4 transition-all hover:opacity-90"
          style={{ backgroundColor: NAVY }}
        >
          Get Next Income Finder — $17
        </a>

        <p className="text-[13px] text-gray-400">
          Already purchased?{' '}
          <Link href="/login" className="underline hover:text-gray-600">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
