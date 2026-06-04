'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const NAVY = '#1B3A5C'
const SAGE = '#7D9B7F'
const OFF_WHITE = '#f5f0eb'
const BUY_URL = 'https://buy.stripe.com/00w00kcSG3Saa759cBfjG02'

// ─── Accordion primitives ─────────────────────────────────────────────────────

function AccordionItem({
  title,
  children,
  isOpen,
  onToggle,
  className = '',
}: {
  title: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <div className={`border-b border-[rgba(52,38,32,0.1)] last:border-0 ${className}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-5 text-left gap-4 cursor-pointer group"
      >
        <span className="font-semibold text-[#1B3A5C] text-[15px] leading-snug group-hover:text-[#7D9B7F] transition-colors">
          {title}
        </span>
        <svg
          className={`w-5 h-5 shrink-0 mt-0.5 text-[#7D9B7F] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-250 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// ─── CTA Button ───────────────────────────────────────────────────────────────

function BuyButton({
  label = 'Get My Ranked Income Options — $27',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <a
      href={BUY_URL}
      className={`inline-block w-full md:w-auto text-center bg-[#1B3A5C] text-white font-semibold text-base px-8 py-4 rounded-lg transition-all duration-150 hover:bg-[#122740] active:scale-[0.985] cursor-pointer ${className}`}
    >
      {label}
    </a>
  )
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400 text-sm">
      {'★★★★★'.split('').map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  )
}

// ─── Check icon ───────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg
      className="w-5 h-5 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke={SAGE}
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesPage() {
  // Steps accordion state
  const [openStep, setOpenStep] = useState<number | null>(0)
  const toggleStep = (i: number) => setOpenStep(openStep === i ? null : i)

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i)

  // ── Steps data ──────────────────────────────────────────────────────────────

  const steps = [
    {
      title: 'Step 1: Describe your situation right now',
      body: 'You tell Next Income Finder what has changed, how many hours you have, your energy on a typical day, and what money you could put toward building something new, so it works from your real constraints, not assumptions.',
      bullets: [
        'Covers health changes, job loss, caregiving, financial pressure, divorce, or any combination',
        'You say how much time and energy you actually have, not how much you wish you had',
      ],
    },
    {
      title: 'Step 2: Share your skills and what you know',
      body: "You write down what you've done in jobs, volunteer roles, and everyday life, including things you've never been paid for, so Next Income Finder can spot assets you've stopped counting as assets.",
      bullets: [
        "No filter needed, industries you know, skills you use daily without thinking, things you figured out on your own",
        "The tool looks for what you already have, not what you'd need to build from scratch",
      ],
    },
    {
      title: 'Step 3: Tell it what a good outcome looks like for you',
      body: 'You describe what moving forward actually means to you, a specific income number, work that fits your health, something you can start without a big investment, and Next Income Finder uses that to rank what it returns.',
      bullets: [
        'Could be a dollar amount, a type of work, a timeline, or simply something you can start in the next few weeks',
        'Your answer shapes the ranking, Option 1 is the most realistic fit for what you told it',
      ],
    },
    {
      title: 'Step 4: Receive your ranked list of 5 income options',
      body: 'You get five numbered income options, ranked from most to least realistic for your specific situation, each with a plain-English description of what the work actually involves day to day, why it fits you, how long until first income, and one concrete action to take this week.',
      bullets: [
        'Each option card shows: time to first income, weekly hours and energy demand, and your single first experiment',
        'A highlighted card at the end names the one most important thing to do first, pulled from Option 1',
      ],
    },
    {
      title: 'Step 5: Follow the next-step guidance and come back',
      body: 'You get a short forward-looking section that tells you exactly what to update when you return, what new information to add based on what you learn from your first experiment, and how the next result builds on this one.',
      bullets: [
        'Tells you which input field to update after your first experiment',
        'Each time you return, the output gets sharper, built for where you actually are, not where you started',
      ],
    },
  ]

  // ── FAQ data ─────────────────────────────────────────────────────────────────

  const faqs = [
    {
      q: 'How long does this take?',
      a: 'Most people complete the three input fields in 10 to 20 minutes. The output is ready immediately after you submit. You can read through your ranked options and have a first experiment in your hands the same day.',
    },
    {
      q: "I'm dealing with a health issue and my situation changes week to week. Will this still work for me?",
      a: "Yes, and it's actually designed for exactly this. You describe your energy and available hours as they are right now, on a typical day. The options Next Income Finder returns are ranked by how realistic they are given those constraints. When your situation changes, you come back, update your inputs, and get a new output that reflects where you are then.",
    },
    {
      q: "I don't have any savings to invest in building something. Does that matter?",
      a: "It's one of the inputs you share, and it directly shapes what Next Income Finder returns. Options that require upfront investment will rank lower or not appear. The output you get will be filtered for what's actually possible with the financial position you described, not what would be possible with more money.",
    },
    {
      q: 'Is this a course or a coaching program?',
      a: 'No. Next Income Finder is a tool. You answer 3 questions, you get a detailed ranked output, and you walk away with a specific first experiment to try this week. There are no modules to work through, no sessions to book, and no timeline beyond the one you set yourself.',
    },
    {
      q: "What if I don't recognize myself in any of the options it gives me?",
      a: 'The options are built entirely from what you type in. If something doesn\'t feel right, go back and add more detail to your situation, your skills, or what a good outcome looks like for you, then run it again. The more specific your inputs, the more precisely the output fits.',
    },
  ]

  // ── Pain cards ───────────────────────────────────────────────────────────────

  const painCards = [
    {
      emoji: '😔',
      title: 'You sit down to plan and go blank',
      body: 'You open the laptop, stare at it, close it. Nothing comes. Another day gone.',
    },
    {
      emoji: '😣',
      title: 'Every option feels built for someone else',
      body: 'The advice assumes unlimited time, energy, and money. You have none of those right now.',
    },
    {
      emoji: '😫',
      title: 'Real financial pressure, no clear direction',
      body: "The bills are real. The pressure is daily. But you can't see where to start.",
    },
    {
      emoji: '🥲',
      title: "You're afraid to plan and fail again",
      body: "Another disappointment feels like something you don't have the energy to recover from.",
    },
  ]

  // ── Benefit cards ────────────────────────────────────────────────────────────

  const benefitCards = [
    {
      emoji: '✨',
      title: 'You see a real option that fits your life',
      body: "You look at your results and think: yes, I can actually do that, given my health, my hours, and where I am right now.",
    },
    {
      emoji: '🌱',
      title: 'You stop feeling behind and start building',
      body: 'You go from someone surviving the day to someone who has a specific small thing to work on, and that shift is everything.',
    },
    {
      emoji: '✅',
      title: 'Your constraints become the starting point',
      body: 'The less time, money, and energy you have right now, the more precisely Next Income Finder filters what it returns, your limits are the input, not the obstacle.',
    },
    {
      emoji: '🌅',
      title: 'You leave with one clear first move',
      body: 'Not a list of things to think about, one specific action, this week, that belongs to the income option most realistic for you right now.',
    },
  ]

  // ── For you if ───────────────────────────────────────────────────────────────

  const forYouItems = [
    "Your life changed in a way you didn't choose, illness, job loss, caregiving, divorce, or something else entirely, and you haven't been able to see a clear way forward since",
    "You've tried journaling it out, talking to friends, or reading articles, and while it helps you feel heard, nobody has actually told you what to do or where to start",
    "Every program or course you find is too expensive, too long, or built for someone with unlimited energy and a clean slate, not for someone managing real constraints",
    "You have financial pressure on top of everything else, so anything that feels like a luxury or a long project feels impossible to justify",
    "You want something specific, an actual option that fits your health, your hours, your money, and who you are now, not another list of things to think about",
  ]

  // ── Testimonials ─────────────────────────────────────────────────────────────

  const testimonials = [
    {
      quote:
        "I've been paralyzed for months. Within 20 minutes of using Next Income Finder I had three options I could actually see myself doing this week. One of them I'd never thought of, and it fits my health situation perfectly.",
      name: 'Sandra M.',
      role: 'Former teacher, navigating health changes at 54',
    },
    {
      quote:
        "I kept finding advice that assumed I had savings, energy, and free time. This finally worked from what I actually have. I started my first experiment four days after getting my results.",
      name: 'Kathryn R.',
      role: 'Caregiver and part-time freelancer, 49',
    },
    {
      quote:
        "I was so afraid to make a plan because I couldn't face another failure. This gave me something small and specific enough that it didn't feel like a risk. It felt like a first step.",
      name: 'Diane L.',
      role: 'Navigating divorce and job loss at 52',
    },
  ]

  // ── Objections ───────────────────────────────────────────────────────────────

  const objections = [
    {
      fear: "I've tried things before and they didn't work. I can't afford another disappointment.",
      reframe:
        "Next Income Finder doesn't ask you to commit to a plan. It gives you one small first experiment from the option that fits your constraints best. That's not a leap, it's a single step. Small enough to try, specific enough to tell you something real.",
    },
    {
      fear: 'Everything I find is built for someone younger with more energy and money than me.',
      reframe:
        "Next Income Finder starts from your actual health, hours, and budget, not an ideal version of them. The more constrained your situation, the more precisely it filters. It was built specifically for this: real constraints, not a clean slate.",
    },
    {
      fear: "I don't have time for a long course or program right now.",
      reframe:
        'This is not a course. You answer 3 questions and you get a ranked, specific output you can act on the same day. The whole process takes less time than most people spend staring at a blank page.',
    },
    {
      fear: 'What if none of the options are right for me?',
      reframe:
        "The options are built from what you type in, your skills, your hours, your energy, your financial position, and what a good outcome looks like to you. They're not pulled from a generic list; they're filtered through your specific situation.",
    },
  ]

  // ── Value stack items ─────────────────────────────────────────────────────────

  const valueItems = [
    {
      label: 'Personalized income options ranked by how realistic they are for your exact situation',
      value: '$97',
    },
    {
      label: 'A plain-language breakdown of what each income type actually involves day to day',
      value: '$47',
    },
    {
      label: 'Time-to-first-income and weekly energy demand for every option',
      value: '$37',
    },
    {
      label: 'One concrete first experiment for this week, specific to Option 1',
      value: '$47',
    },
    {
      label: 'A forward-looking next-step guide so you know exactly what to do after your first experiment',
      value: '$37',
    },
  ]

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Sticky urgency bar + nav ─────────────────────────────────────── */}
      <div className="sticky top-0 z-50">
        {/* Urgency bar */}
        <div
          style={{ backgroundColor: NAVY }}
          className="w-full py-3 text-center text-white text-sm font-medium tracking-wide"
        >
          Only $27 now.{' '}
          <span className="opacity-80">Price goes up soon.</span>
        </div>

        {/* Nav */}
        <nav className="bg-white border-b border-[rgba(52,38,32,0.08)] px-5 md:px-10 py-3 flex items-center justify-between">
          <span className="font-lora font-bold text-[17px] text-[#1B3A5C] tracking-tight">
            Next Income Finder
          </span>
          <div className="flex items-center gap-5">
            <a
              href="#faq"
              className="hidden md:block text-sm text-gray-500 hover:text-[#1B3A5C] transition-colors"
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="hidden md:block text-sm text-gray-500 hover:text-[#1B3A5C] transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="text-sm font-medium text-[#7D9B7F] hover:text-[#5A7A5C] transition-colors"
            >
              Log in
            </Link>
            <a
              href={BUY_URL}
              className="hidden md:inline-block bg-[#1B3A5C] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#122740] active:scale-[0.985] transition-all cursor-pointer"
            >
              Get Access — $27
            </a>
          </div>
        </nav>
      </div>

      <main className="overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="bg-white py-16 md:py-24 px-5">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[13px] uppercase tracking-[0.12em] font-semibold text-[#7D9B7F] mb-4">
              Next Income Finder
            </p>
            <h1 className="font-lora font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight text-[#1B3A5C] mb-6">
              See exactly which income options{' '}
              <em className="not-italic" style={{ color: SAGE }}>
                fit your life right now
              </em>
            </h1>
            <p className="text-[17px] md:text-[19px] text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Answer 3 questions about your real situation today and get a ranked list of income options built around your health, your hours, and what you actually have to work with, so you leave with something specific to start on, not another idea to think about.
            </p>
            <BuyButton className="text-[17px] px-10 py-4 shadow-md" />
            <p className="mt-4 text-sm text-gray-400">
              Instant access. No course. No generic advice.
            </p>

            {/* ── Hero photo ── */}
            <div className="mt-12 mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src="/hero-photo.png"
                alt="Next Income Finder — a real plan for your real life"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────────── */}
        <section style={{ backgroundColor: OFF_WHITE }} className="py-6 px-5">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-center">
            {['3 Questions Only', '$27 Price', 'Instant Access'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7D9B7F] shrink-0" />
                <span className="text-[15px] font-semibold text-[#1B3A5C]">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── THE STRUGGLE ─────────────────────────────────────────────────── */}
        <section id="struggle" className="bg-white py-16 md:py-20 px-5">
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] uppercase tracking-[0.12em] font-semibold text-[#7D9B7F] mb-3">
              Does this sound familiar?
            </p>
            <h2 className="font-lora font-bold text-[30px] md:text-[38px] tracking-tight text-[#1B3A5C] mb-6 leading-snug">
              You know the old plan is gone. You just can't see the{' '}
              <em className="not-italic" style={{ color: SAGE }}>new one</em> yet.
            </h2>
            <p className="text-[16px] text-gray-500 leading-relaxed mb-4">
              That blank feeling is not a sign something is wrong with you.
            </p>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed mb-10">
              <p>
                The old plan is gone. Not because you failed, but because life interrupted it, illness, a job loss, caregiving, a relationship ending, or simply the growing realization that the path you were on no longer fits who you are now.
              </p>
              <p>
                You sit down to figure out what comes next and your mind goes completely blank. So you close the laptop and call it a day, again. Every tool or program you find is either too expensive, too time-consuming, or built for a 28-year-old starting fresh.
              </p>
              <p>
                The financial pressure is real. The responsibilities are real. What's been missing is something that works from your actual life today, not an ideal version of it.
              </p>
              <p className="font-medium text-[#1B3A5C]">
                If you're a woman in midlife navigating a major change with real responsibilities and real financial pressure, this is probably your reality right now:
              </p>
            </div>

            {/* Pain cards 2×2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {painCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-[#fdfcfb] p-5 hover:-translate-y-0.5 transition-transform duration-150"
                >
                  <div className="text-2xl mb-2">{card.emoji}</div>
                  <p className="font-semibold text-[#1B3A5C] text-[15px] mb-1">
                    {card.title}
                  </p>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[15px] text-gray-600 leading-relaxed mb-1">
              You are not stuck because something is wrong with you. You've just been missing the right starting point.
            </p>
            <p className="text-[15px] font-semibold text-[#1B3A5C] leading-relaxed">
              That's exactly what Next Income Finder gives you, a specific, ranked list of income options built around the life you have today.
            </p>
          </div>
        </section>

        {/* ── WHAT CHANGES ─────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: OFF_WHITE }} className="py-16 md:py-20 px-5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-lora font-bold text-[28px] md:text-[36px] tracking-tight text-[#1B3A5C] mb-10 leading-snug text-center">
              What changes when{' '}
              <em className="not-italic" style={{ color: SAGE }}>
                Next Income Finder
              </em>{' '}
              is in your hands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-white p-6 hover:-translate-y-0.5 transition-transform duration-150"
                >
                  <div className="text-2xl mb-3">{card.emoji}</div>
                  <p className="font-semibold text-[#1B3A5C] text-[15px] mb-2">
                    {card.title}
                  </p>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-white py-16 md:py-20 px-5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-lora font-bold text-[28px] md:text-[36px] tracking-tight text-[#1B3A5C] mb-3 leading-snug">
              Here's exactly what happens inside Next Income Finder
            </h2>
            <p className="text-[16px] text-gray-500 leading-relaxed mb-10">
              Three inputs. Five ranked income options. One clear first move, all built from the life you actually have right now.
            </p>

            <div className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-[#fdfcfb] divide-y divide-[rgba(52,38,32,0.08)] overflow-hidden">
              {steps.map((step, i) => (
                <AccordionItem
                  key={i}
                  title={
                    <span className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: SAGE }}
                      >
                        {i + 1}
                      </span>
                      {step.title}
                    </span>
                  }
                  isOpen={openStep === i}
                  onToggle={() => toggleStep(i)}
                  className="px-5 md:px-6"
                >
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-3">
                    {step.body}
                  </p>
                  <ul className="space-y-1.5">
                    {step.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2.5 text-[14px] text-gray-500">
                        <span className="text-[#7D9B7F] font-bold shrink-0 mt-0.5">·</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tool mockup ─────────────────────────────────────────────────── */}
        <section className="bg-white pb-10 px-5">
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-[13px] uppercase tracking-widest font-medium text-[#7D9B7F] mb-4">
              What your results look like
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="/tool-mockup.png"
                alt="Next Income Finder output — 5 ranked income options"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </section>

        {/* ── THIS IS FOR YOU IF ───────────────────────────────────────────── */}
        <section id="for-you" style={{ backgroundColor: OFF_WHITE }} className="py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-lora font-bold text-[28px] md:text-[34px] tracking-tight text-[#1B3A5C] mb-8 leading-snug">
              This is for you if
            </h2>
            <ul className="space-y-4">
              {forYouItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[15px] text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section id="testimonials" className="bg-white py-16 md:py-20 px-5">
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] uppercase tracking-[0.12em] font-semibold text-[#7D9B7F] mb-3 text-center">
              What people are saying
            </p>
            <p className="text-center text-[13px] text-gray-400 mb-10 italic">
              Replace these with your real testimonials once you have them.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-[#fdfcfb] p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-150"
                >
                  <Stars />
                  <p className="text-[14px] text-gray-700 leading-relaxed flex-1">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-[#1B3A5C] text-[13px]">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <section id="pricing" style={{ backgroundColor: OFF_WHITE }} className="py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-lora font-bold text-[28px] md:text-[36px] tracking-tight text-[#1B3A5C] mb-4 leading-snug">
              Get your ranked income options today
            </h2>

            <div className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-white p-8 md:p-10 mb-6">
              <p className="text-[56px] font-extrabold font-lora text-[#1B3A5C] leading-none mb-1">
                $27
              </p>
              <p className="text-[13px] text-[#7D9B7F] font-semibold uppercase tracking-wide mb-6">
                Price goes up soon.
              </p>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-8">
                A clarity session with a career coach or business mentor runs $150 to $300 for a single hour, and they rarely have time to map every option against your specific health, hours, and budget the way Next Income Finder does. For $27 you get a detailed, ranked output built entirely from your real situation, available the moment you finish answering 3 questions.
              </p>
              <BuyButton label="Get My Ranked Income Options — $27" className="text-[16px]" />
              <p className="mt-4 text-[13px] text-gray-400">
                Instant access. Answer 3 questions and get a specific, ranked output built from your real life today. No long course. No generic advice.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
        <section
          style={{ backgroundColor: NAVY }}
          className="py-14 md:py-16 px-5"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-lora font-bold text-[28px] md:text-[36px] tracking-tight text-white mb-4 leading-snug">
              Stop surviving the day.{' '}
              <em className="not-italic opacity-80">Start building.</em>
            </h2>
            <p className="text-white/70 text-[16px] leading-relaxed mb-8">
              Instant access. Answer 3 questions and get a specific, ranked output built from your real life today. No long course. No generic advice.
            </p>
            <a
              href={BUY_URL}
              className="inline-block w-full md:w-auto text-center bg-white text-[#1B3A5C] font-bold text-[17px] px-10 py-4 rounded-lg hover:bg-gray-100 active:scale-[0.985] transition-all cursor-pointer"
            >
              Get My Ranked Income Options — $27
            </a>
          </div>
        </section>

        {/* ── ABOUT VESLEMØY ───────────────────────────────────────────────── */}
        <section id="about" style={{ backgroundColor: OFF_WHITE }} className="py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto">
            <p className="text-[12px] uppercase tracking-[0.12em] font-semibold text-[#7D9B7F] mb-4">
              A note from Veslemøy
            </p>
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-10 h-10 rounded-full shrink-0 mt-1 flex items-center justify-center text-white font-lora font-bold text-lg"
                style={{ backgroundColor: SAGE }}
              >
                V
              </div>
              <h2 className="font-lora font-bold text-[26px] md:text-[32px] tracking-tight text-[#1B3A5C] leading-snug">
                Hey, I'm Veslemøy.
              </h2>
            </div>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
              <p>
                I'm a geoscientist, entrepreneur, and mentor. Most of my career pivots came from external disruptions — layoffs, industry shifts, the demands of raising two children while building something meaningful. But it was a recent health challenge that stopped me in my tracks and made me build this tool.
              </p>
              <p>
                I built Next Income Finder because I kept watching the same pattern play out: a carefully constructed life gets interrupted by something nobody planned for, and the advice that follows assumes unlimited energy, time, and freedom to start over. Real life doesn't work that way.
              </p>
              <p>
                Everything I create is designed for women with real constraints, not a clean slate, and my mission is to help you become less afraid of uncertainty and more clear on what your actual options are.
              </p>
            </div>
          </div>
        </section>

        {/* ── COST OF WAITING ──────────────────────────────────────────────── */}
        <section className="bg-white py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-lora font-bold text-[26px] md:text-[34px] tracking-tight text-[#1B3A5C] mb-6 leading-snug">
              What three more months of staring at a{' '}
              <em className="not-italic" style={{ color: SAGE }}>blank page</em> costs you
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
              <p>
                Three months from now, the financial pressure is still there. The dread that wakes you up most mornings is still there. And you're still surviving the day instead of building anything, not because you aren't capable, but because you never had something specific enough to start on.
              </p>
              <p>
                Every week without a direction is a week of real income you don't get back. The clarity you're waiting to feel on your own is not coming, it comes from having something concrete in front of you.
              </p>
              <p className="font-semibold text-[#1B3A5C]">
                Next Income Finder gives you that in the time it takes to answer 3 questions.
              </p>
            </div>
            <div className="mt-8">
              <BuyButton />
            </div>
          </div>
        </section>

        {/* ── OBJECTIONS ───────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: OFF_WHITE }} className="py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-lora font-bold text-[26px] md:text-[32px] tracking-tight text-[#1B3A5C] mb-8 leading-snug">
              Real questions before you buy
            </h2>
            <div className="space-y-4">
              {objections.map((obj, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-white overflow-hidden hover:-translate-y-0.5 transition-transform duration-150"
                >
                  <div className="flex items-start gap-3 px-5 py-4 border-b border-[rgba(52,38,32,0.06)]">
                    <span className="text-red-400 font-bold text-lg shrink-0 mt-0.5">✕</span>
                    <p className="text-[14px] text-gray-500 italic leading-relaxed">
                      "{obj.fear}"
                    </p>
                  </div>
                  <div className="flex items-start gap-3 px-5 py-4">
                    <span className="font-bold text-lg shrink-0 mt-0.5" style={{ color: SAGE }}>
                      ✓
                    </span>
                    <p className="text-[14px] text-gray-700 leading-relaxed">
                      {obj.reframe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VALUE STACK ──────────────────────────────────────────────────── */}
        <section className="bg-white py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-lora font-bold text-[26px] md:text-[32px] tracking-tight text-[#1B3A5C] mb-8 leading-snug">
              Everything inside Next Income Finder
            </h2>

            <div className="rounded-2xl border border-[rgba(52,38,32,0.1)] overflow-hidden">
              <div style={{ backgroundColor: OFF_WHITE }} className="px-5 py-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[17px] font-bold text-[#1B3A5C]">Next Income Finder</span>
                  <span className="text-[28px] font-extrabold font-lora text-[#1B3A5C]">
                    $27
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px]" style={{ color: SAGE }}>
                    Launch pricing. Instant access.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <BuyButton className="text-[16px] shadow-md" />
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section id="faq" style={{ backgroundColor: OFF_WHITE }} className="py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-lora font-bold text-[26px] md:text-[32px] tracking-tight text-[#1B3A5C] mb-8 leading-snug">
              Frequently asked questions
            </h2>
            <div className="rounded-2xl border border-[rgba(52,38,32,0.1)] bg-white divide-y divide-[rgba(52,38,32,0.08)] overflow-hidden">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  title={faq.q}
                  isOpen={openFaq === i}
                  onToggle={() => toggleFaq(i)}
                  className="px-5 md:px-6"
                >
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </AccordionItem>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="bg-white py-16 md:py-20 px-5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-lora font-bold text-[28px] md:text-[36px] tracking-tight text-[#1B3A5C] mb-4 leading-snug">
              Ready to see what's actually{' '}
              <em className="not-italic" style={{ color: SAGE }}>
                possible for you?
              </em>
            </h2>
            <p className="text-[16px] text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
              Answer 3 questions. Get a ranked, specific income plan built around your health, your hours, and your life as it is right now.
            </p>
            <BuyButton label="Get My Ranked Income Options — $27" className="text-[17px] shadow-md" />
            <p className="mt-4 text-[13px] text-gray-400">
              $27 · Instant access · No course, no coaching call, no fluff
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer
          style={{ backgroundColor: NAVY }}
          className="py-8 px-5 text-center"
        >
          <p className="font-lora font-bold text-white text-[15px] mb-2">
            Next Income Finder
          </p>
          <div className="flex items-center justify-center gap-5 text-white/50 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">
              Log in
            </Link>
            <a href={BUY_URL} className="hover:text-white transition-colors">
              Get Access
            </a>
          </div>
          <p className="text-white/30 text-xs mt-4">
            © {new Date().getFullYear()} Next Income Finder. All rights reserved.
          </p>
        </footer>

      </main>
    </>
  )
}
