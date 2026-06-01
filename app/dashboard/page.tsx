import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/DashboardLayout'

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const today = new Date().toISOString().split('T')[0]
  const { data: usage } = await supabase
    .from('ai_usage')
    .select('count')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .maybeSingle()

  const usageCount = (usage as { count: number } | null)?.count ?? 0

  return (
    <DashboardLayout usageCount={usageCount} currentPage="dashboard">
      <div className="min-h-[calc(100vh-0px)] flex items-center justify-center px-5 md:px-12 py-16">
        <div className="w-full max-w-[720px]">
          {/* Welcome */}
          <div className="mb-10">
            <h1 className="font-lora font-extrabold text-[32px] md:text-[36px] text-navy leading-tight mb-3">
              Welcome to Next Income Finder
            </h1>
            <p className="text-[#888] text-lg leading-relaxed max-w-lg">
              Answer three questions about your real life right now and get a
              ranked, specific income plan you can act on today.
            </p>
          </div>

          {/* CTA card */}
          <div className="bg-white border border-gray-200 rounded-card shadow-card p-8 md:p-10 hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F0F5F0] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#7D9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <h2 className="font-lora font-semibold text-xl text-navy mb-1">
                  Your AI Income Advisor
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Tell it what your life is like right now. It will surface the
                  5 most realistic income options for your specific situation,
                  energy, and available hours — ranked, with a first step for
                  each one.
                </p>
              </div>
            </div>

            <Link
              href="/tool"
              className="flex items-center justify-center gap-2 w-full h-[52px] bg-navy text-white font-bold text-base rounded-[10px] transition-all duration-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:scale-[1.005] cursor-pointer"
            >
              Open Tool
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Info row */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Questions', value: '3' },
              { label: 'Ranked options', value: '5' },
              { label: 'Daily uses left', value: String(20 - usageCount) },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm"
              >
                <div className="font-lora font-bold text-2xl text-navy">
                  {item.value}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
