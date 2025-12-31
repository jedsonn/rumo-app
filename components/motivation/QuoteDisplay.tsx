'use client'

import { useState, useEffect } from 'react'
import { Quote } from '@/lib/types'
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'

interface QuoteDisplayProps {
  quotes: Quote[]
  compact?: boolean
}

export function QuoteDisplay({ quotes, compact = false }: QuoteDisplayProps) {
  const { isBlue } = useDashboard()
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Select random quote on mount
  useEffect(() => {
    if (quotes.length > 0) {
      selectRandomQuote()
    }
  }, [quotes])

  const selectRandomQuote = () => {
    if (quotes.length === 0) return

    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
      setIsAnimating(false)
    }, 300)
  }

  if (!currentQuote) {
    return null
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isBlue ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
      }`}>
        <QuoteIcon size={14} className={isBlue ? 'text-blue-400' : 'text-rose-400'} />
        <p className={`text-xs italic text-slate-600 dark:text-slate-400 truncate transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}>
          "{currentQuote.text}"
          {currentQuote.author && (
            <span className="text-slate-400 dark:text-slate-500"> — {currentQuote.author}</span>
          )}
        </p>
        <button
          onClick={selectRandomQuote}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors shrink-0"
          title="New quote"
        >
          <RefreshCw size={12} className="text-slate-400" />
        </button>
      </div>
    )
  }

  return (
    <div className={`relative p-6 rounded-2xl ${
      isBlue
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
        : 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20'
    }`}>
      <QuoteIcon
        size={40}
        className={`absolute top-4 left-4 opacity-10 ${isBlue ? 'text-blue-500' : 'text-rose-500'}`}
      />

      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <blockquote className="relative z-10 text-lg font-medium text-slate-700 dark:text-slate-200 italic mb-3 pl-6">
          "{currentQuote.text}"
        </blockquote>

        {currentQuote.author && (
          <p className={`text-sm font-medium pl-6 ${isBlue ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
            — {currentQuote.author}
          </p>
        )}
      </div>

      <button
        onClick={selectRandomQuote}
        className={`absolute bottom-4 right-4 p-2 rounded-full hover:opacity-80 transition-all ${
          isBlue
            ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300'
            : 'bg-rose-100 dark:bg-rose-800/50 text-rose-600 dark:text-rose-300'
        }`}
        title="Get another quote"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  )
}
