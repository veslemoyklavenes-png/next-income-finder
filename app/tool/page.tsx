'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string
  created_at: string
  output: string
  inputs: { situation: string; skills: string; matters: string }
}

interface IncomeOption {
  number: number
  name: string
  content: string
}

interface ParsedOutput {
  section1: string
  section2: string
  section3Options: IncomeOption[]
  section3Header: string
  section4: string
  section5: string
  rawText: string
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseSections(text: string): ParsedOutput | null {
  // Split on "Section N" markers (with optional surrounding ** and varying separators)
  const parts = text.split(/(?=\*{0,2}Section\s+[1-5]\b)/gi)

  const sectionMap: Record<number, string> = {}
  for (const part of parts) {
    const m = part.match(/^\*{0,2}Section\s+(\d+)[^*\n]*\*{0,2}\n?([\s\S]*)/)
    if (m) {
      sectionMap[Number(m[1])] = m[2].trim()
    }
  }

  if (!sectionMap[1] || !sectionMap[2] || !sectionMap[3] || !sectionMap[4] || !sectionMap[5]) {
    return null
  }

  const section3Options = parseOptions(sectionMap[3])

  return {
    section1: sectionMap[1],
    section2: sectionMap[2],
    section3Header: 'Your Top 5 Income Options (Ranked)',
    section3Options,
    section4: sectionMap[4],
    section5: sectionMap[5],
    rawText: text,
  }
}

function parseOptions(text: string): IncomeOption[] {
  // Split on lines like "**1." or "1." at the start of a block
  const blocks = text.split(/(?=\n?\*{0,2}[1-5]\.\s+)/).filter((b) =>
    /^[\s*]*[1-5]\.\s+/.test(b.trim())
  )

  return blocks.slice(0, 5).map((block, i) => {
    const nameMatch = block.match(/[1-5]\.\s+\*{0,2}([^\n*]+)\*{0,2}/)
    return {
      number: i + 1,
      name: nameMatch ? nameMatch[1].trim() : `Option ${i + 1}`,
      content: block.trim(),
    }
  })
}

// ─── Inline markdown renderer ────────────────────────────────────────────────

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part))
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
        if (/^\*[^*]+\*$/.test(part))
          return <em key={i}>{part.slice(1, -1)}</em>
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function BlockText({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  const pendingBullets: string[] = []

  const flushBullets = (key: string) => {
    if (pendingBullets.length === 0) return
    nodes.push(
      <ul key={key} className="list-disc pl-5 space-y-1 my-2 text-[15px] leading-[1.65]">
        {pendingBullets.map((b, bi) => (
          <li key={bi}>
            <InlineText text={b} />
          </li>
        ))}
      </ul>
    )
    pendingBullets.length = 0
  }

  lines.forEach((raw, i) => {
    const line = raw.trim().replace(/^#{1,6}\s*/, '')
    if (!line || line === '---') {
      flushBullets(`bullet-${i}`)
      return
    }

    if (line.startsWith('- ') || line.startsWith('* ') && line.length > 2 && !line.startsWith('**')) {
      pendingBullets.push(line.slice(2))
      return
    }

    flushBullets(`bullet-${i}`)

    // Labeled line: *Label*: value  or  **Label**: value
    const labeledMatch = line.match(/^\*{1,2}([^*:]+)\*{1,2}:\s*(.+)$/)
    if (labeledMatch) {
      nodes.push(
        <p key={i} className="text-[15px] leading-[1.65] mb-1">
          <em className="font-medium text-gray-500 not-italic">{labeledMatch[1]}:</em>{' '}
          <InlineText text={labeledMatch[2]} />
        </p>
      )
      return
    }

    // Full-line bold heading
    const headingMatch = line.match(/^\*\*(.+)\*\*$/)
    if (headingMatch) {
      nodes.push(
        <p key={i} className="font-semibold text-navy text-[15px] leading-[1.65] mt-3 mb-1">
          {headingMatch[1]}
        </p>
      )
      return
    }

    nodes.push(
      <p key={i} className="text-[15px] leading-[1.65] mb-1">
        <InlineText text={line} />
      </p>
    )
  })

  flushBullets('bullet-end')

  return <div className={className}>{nodes}</div>
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available in some contexts
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer ${
        copied
          ? 'text-green-600 bg-green-50'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      } ${className}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

// ─── Chevron ──────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform duration-250 shrink-0 ${open ? '' : '-rotate-180'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  copyText,
  children,
  highlight = false,
  defaultOpen = true,
}: {
  title: string
  copyText: string
  children: React.ReactNode
  highlight?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={`rounded-card border shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden ${
        highlight
          ? 'border-[#7D9B7F] bg-[#F0F5F0]'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[3px] h-6 bg-[#7D9B7F] rounded-full shrink-0" />
          <h3 className="font-lora font-semibold text-[20px] text-navy leading-snug">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <CopyButton text={copyText} />
          <Chevron open={open} />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-250 ease-in-out ${
          open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Income option sub-card ───────────────────────────────────────────────────

function OptionCard({
  option,
  defaultOpen,
}: {
  option: IncomeOption
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden hover:shadow-sm transition-shadow duration-150">
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-6 h-6 rounded-full bg-[#7D9B7F] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {option.number}
          </span>
          <span className="font-semibold text-navy text-[15px] truncate">
            {option.name}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <CopyButton text={option.content} />
          <Chevron open={open} />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-250 ease-in-out ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 border-t border-gray-100">
          <BlockText text={option.content} className="mt-4" />
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ToolPage() {
  const supabase = createClient()

  const [situation, setSituation] = useState('')
  const [skills, setSkills] = useState('')
  const [matters, setMatters] = useState('')

  const [isGenerating, setIsGenerating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [parsedOutput, setParsedOutput] = useState<ParsedOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)

  const [usageCount, setUsageCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)

  const [optionsDefaultOpen, setOptionsDefaultOpen] = useState(true)
  const [copiedAll, setCopiedAll] = useState(false)

  const outputRef = useRef<HTMLDivElement>(null)

  // Detect mobile for Section 3 sub-card default state
  useEffect(() => {
    const check = () => setOptionsDefaultOpen(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Init: get user + usage + history
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUserId(session.user.id)
      await Promise.all([
        fetchUsage(session.user.id),
        fetchHistory(session.user.id),
      ])
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUsage = useCallback(async (uid: string) => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('ai_usage')
      .select('count')
      .eq('user_id', uid)
      .eq('date', today)
      .maybeSingle()
    setUsageCount((data as { count: number } | null)?.count ?? 0)
  }, [supabase])

  const fetchHistory = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('generation_history')
      .select('id, created_at, output, inputs')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(5)
    setHistory((data as HistoryItem[]) ?? [])
  }, [supabase])

  const restoreFromHistory = (item: HistoryItem) => {
    if (item.inputs) {
      setSituation(item.inputs.situation ?? '')
      setSkills(item.inputs.skills ?? '')
      setMatters(item.inputs.matters ?? '')
    }
    const parsed = parseSections(item.output)
    setParsedOutput(parsed)
    setStreamText(item.output)
    setHasGenerated(true)
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!situation.trim() || !skills.trim() || !matters.trim()) {
      setError('Please fill in all three fields before generating.')
      return
    }

    if (usageCount >= 20) {
      setError('You have reached your daily limit of 20 uses. Come back tomorrow.')
      return
    }

    setIsGenerating(true)
    setStreamText('')
    setParsedOutput(null)
    setHasGenerated(true)

    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation, skills, matters }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Generation failed.' }))
        throw new Error(data.error ?? `Error ${res.status}`)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setStreamText(accumulated)
      }

      // Parse + refresh data
      const parsed = parseSections(accumulated)
      setParsedOutput(parsed)

      if (userId) {
        await Promise.all([fetchUsage(userId), fetchHistory(userId)])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyAll = async () => {
    const text = parsedOutput?.rawText ?? streamText
    if (!text) return
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  const fields = [
    {
      id: 'situation',
      label: 'Your situation right now',
      value: situation,
      onChange: setSituation,
      placeholder:
        'Tell me what has changed. You might be dealing with a health issue, a job loss, caregiving for someone, a divorce, financial pressure, or something else entirely. What is your life actually like right now? What do you have to work with: roughly how many hours a week, how much energy on a typical day, and any money you could put toward building something new? Be as specific as you can. There are no wrong answers here.',
    },
    {
      id: 'skills',
      label: 'Your skills and experience',
      value: skills,
      onChange: setSkills,
      placeholder:
        'What have you done in your life and work? This could be jobs, volunteer roles, things you have figured out on your own, industries you know well, or skills you use every day without thinking of them as skills. Include things you are good at that you have never been paid for. Do not filter yourself, write it all down.',
    },
    {
      id: 'matters',
      label: 'What matters most to you right now',
      value: matters,
      onChange: setMatters,
      placeholder:
        'What does a good outcome look like for you? It might be a specific income number, a type of work that fits your health, something you can do from home, work that gives you meaning, or simply something you can start in the next few weeks without a big investment. What would make you feel like you are moving forward?',
    },
  ]

  return (
    <DashboardLayout usageCount={usageCount} currentPage="tool">
      <div className="px-5 md:px-12 py-10 max-w-[720px] mx-auto">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-lora font-extrabold text-[28px] md:text-[32px] text-navy mb-2">
            Next Income Finder
          </h1>
          <p className="text-[#888] text-[15px] leading-relaxed">
            Tell me about your real life right now. I will rank the 5 most
            realistic income options for your specific situation.
          </p>
        </div>

        {/* ── Input form card ── */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-200 rounded-card shadow-card p-6 mb-6 hover:shadow-card-hover transition-shadow duration-200">
            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-[12px] uppercase tracking-[0.06em] font-medium text-[#888] mb-1.5"
                  >
                    {field.label}
                  </label>
                  <textarea
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    rows={5}
                    maxLength={3000}
                    className="w-full min-h-[120px] px-4 py-3 border border-gray-200 rounded-[10px] text-[15px] leading-[1.65] text-gray-900 placeholder-gray-300 resize-vertical focus:outline-none focus:border-[#7D9B7F] focus:ring-2 focus:ring-[#7D9B7F]/20 transition-all duration-150"
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    <span className={`text-[11px] ${
                      field.value.trim().split(/\s+/).filter(Boolean).length < 20
                        ? 'text-gray-300'
                        : 'text-[#7D9B7F]'
                    }`}>
                      {field.value.trim() === '' ? 'More detail = more precise results' :
                        field.value.trim().split(/\s+/).filter(Boolean).length < 20
                          ? `${field.value.trim().split(/\s+/).filter(Boolean).length} words — a little more detail will improve your results`
                          : `${field.value.trim().split(/\s+/).filter(Boolean).length} words ✓`
                      }
                    </span>
                    <span className="text-[11px] text-gray-300">
                      {field.value.length} / 3000
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="mt-5 w-full h-[52px] bg-navy text-white font-bold text-base rounded-[10px] transition-all duration-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:scale-[1.005] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                'Find My Income Options'
              )}
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              {usageCount} / 20 uses today
            </p>
          </div>
        </form>

        {/* ── Output area ── */}
        <div ref={outputRef}>
          {/* Empty state */}
          {!hasGenerated && (
            <div className="bg-white border border-gray-200 rounded-card shadow-card p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F0F5F0] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#7D9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Your output will appear here.</p>
            </div>
          )}

          {/* Loading skeleton with status message */}
          {isGenerating && streamText.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-card shadow-card p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F0F5F0] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#7D9B7F] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-navy text-[15px] mb-1">
                    Analysing your situation and building your ranked options…
                  </p>
                  <p className="text-[13px] text-gray-400">
                    This takes about 15–20 seconds. Your personalised income plan is on its way.
                  </p>
                </div>
                <div className="w-full space-y-2.5 mt-2">
                  <div className="skeleton-bar h-3 w-2/3 mx-auto" />
                  <div className="skeleton-bar h-3 w-full" />
                  <div className="skeleton-bar h-3 w-5/6 mx-auto" />
                </div>
              </div>
            </div>
          )}

          {/* Streaming live text (before parse) */}
          {isGenerating && streamText.length > 0 && !parsedOutput && (
            <div className="bg-white border border-gray-200 rounded-card shadow-card p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7D9B7F] animate-pulse" />
                  <span className="text-xs text-[#7D9B7F] font-medium">Generating…</span>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-[14px] leading-[1.7] text-gray-700 font-inter">
                {streamText}
              </pre>
            </div>
          )}

          {/* Parsed section cards */}
          {parsedOutput && (
            <div className="space-y-4 animate-fade-in-up">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <h2 className="font-lora font-bold text-navy text-[17px]">Your Result</h2>
                <button
                  onClick={handleCopyAll}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                    copiedAll
                      ? 'text-green-600 bg-green-50 border-green-200'
                      : 'text-gray-500 bg-white border-gray-200 hover:border-[#7D9B7F] hover:text-[#7D9B7F]'
                  }`}
                >
                  {copiedAll ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                      Copy all
                    </>
                  )}
                </button>
              </div>

              {/* Section 1 */}
              <SectionCard
                title="Your Reality Right Now"
                copyText={parsedOutput.section1}
              >
                <BlockText text={parsedOutput.section1} className="text-[15px] leading-[1.65] text-gray-800" />
              </SectionCard>

              {/* Section 2 */}
              <SectionCard
                title="What You Still Have to Work With"
                copyText={parsedOutput.section2}
              >
                <BlockText text={parsedOutput.section2} />
              </SectionCard>

              {/* Section 3 */}
              <SectionCard
                title={parsedOutput.section3Header}
                copyText={parsedOutput.section3Options.map((o) => o.content).join('\n\n')}
              >
                {parsedOutput.section3Options.length > 0 ? (
                  <div className="space-y-3">
                    {parsedOutput.section3Options.map((opt) => (
                      <OptionCard
                        key={opt.number}
                        option={opt}
                        defaultOpen={optionsDefaultOpen}
                      />
                    ))}
                  </div>
                ) : (
                  <BlockText text={parsedOutput.section3Header} />
                )}
              </SectionCard>

              {/* Section 4 — highlighted */}
              <SectionCard
                title="Your First Move"
                copyText={parsedOutput.section4}
                highlight
              >
                <BlockText
                  text={parsedOutput.section4}
                  className="text-[16px] font-semibold leading-[1.65] text-navy"
                />
              </SectionCard>

              {/* Section 5 */}
              <SectionCard
                title="What to Do Next"
                copyText={parsedOutput.section5}
              >
                <BlockText text={parsedOutput.section5} />
              </SectionCard>
            </div>
          )}

          {/* Fallback: raw text after streaming if parse failed */}
          {!isGenerating && hasGenerated && streamText && !parsedOutput && (
            <div className="bg-white border border-gray-200 rounded-card shadow-card p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <span className="font-lora font-semibold text-navy text-[20px]">Your Result</span>
                <CopyButton text={streamText} />
              </div>
              <pre className="whitespace-pre-wrap text-[14px] leading-[1.7] text-gray-700 font-inter">
                {streamText}
              </pre>
            </div>
          )}
        </div>

        {/* ── Previous results ── */}
        {history.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer mb-3"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${historyOpen ? '' : '-rotate-90'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              Previous Results ({history.length})
            </button>

            <div
              className={`overflow-hidden transition-all duration-250 ease-in-out ${
                historyOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => restoreFromHistory(item)}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[#7D9B7F] hover:shadow-sm transition-all duration-150 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {item.output.slice(0, 80)}…
                        </p>
                      </div>
                      <span className="text-xs text-[#7D9B7F] font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        Restore
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </DashboardLayout>
  )
}
