'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Toast } from '@/components/ui/Toast'
import { Plus, Trash2, Sparkles, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'

const BLESSING_SUGGESTIONS = [
  "Good health and energy",
  "Supportive family and friends",
  "A job I find meaningful",
  "A safe place to call home",
  "Access to clean water and food",
  "Freedom to pursue my goals",
  "Moments of peace and quiet",
  "Opportunities to learn and grow",
  "Kind strangers who helped me today",
  "Technology that connects me to loved ones",
  "Nature's beauty around me",
  "Music that lifts my spirit",
  "A good night's sleep",
  "Unexpected kindness received",
  "Progress on something important to me"
]

export default function BlessingsPage() {
  const { blessings, addBlessing, deleteBlessing, isBlue } = useDashboard()
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return

    await addBlessing({
      text: value.trim(),
      category: 'Personal',
    })

    setValue('')
  }

  const regenerateSuggestions = () => {
    const shuffled = [...BLESSING_SUGGESTIONS].sort(() => Math.random() - 0.5)
    setSuggestions(shuffled.slice(0, 5))
  }

  const openSuggestions = () => {
    regenerateSuggestions()
    setShowSuggestions(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-1">
            🙏 Count Your Blessings
          </h2>
          <p className="text-sm text-amber-600/70 dark:text-amber-500/70">
            Gratitude turns what we have into enough
          </p>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="What are you grateful for today?"
            className="flex-1 px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <button
            type="button"
            onClick={openSuggestions}
            className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <Sparkles size={20} />
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
          >
            <Plus size={20} />
          </button>
        </form>

        {/* Blessings List */}
        <div className="space-y-2">
          {blessings.length === 0 ? (
            <div className="text-center py-12 text-amber-600/50 dark:text-amber-500/50">
              <span className="text-4xl">🌟</span>
              <p className="mt-2">Start counting your blessings</p>
            </div>
          ) : (
            blessings.map(blessing => (
              <div
                key={blessing.id}
                className="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50"
              >
                <div>
                  <p className="text-slate-700 dark:text-slate-200">{blessing.text}</p>
                  <p className="text-xs text-amber-500 dark:text-amber-600 mt-0.5">
                    {new Date(blessing.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteBlessing(blessing.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-800/50 text-amber-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Suggestions Modal */}
        <Modal isOpen={showSuggestions} onClose={() => setShowSuggestions(false)} title="Blessing Ideas ✨" size="sm">
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setValue(s)
                  setShowSuggestions(false)
                }}
                className="w-full text-left p-3 rounded-lg border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 dark:text-slate-200"
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={regenerateSuggestions}
            className="w-full mt-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            More Ideas
          </button>
        </Modal>
      </div>

      <Toast />
    </div>
  )
}
