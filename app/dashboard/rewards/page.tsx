'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Toast } from '@/components/ui/Toast'
import { Plus, Trash2, Sparkles, RefreshCw, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'

const REWARD_SUGGESTIONS = [
  { text: "Nice specialty coffee ☕", cost: 8 },
  { text: "Movie night with popcorn 🎬", cost: 25 },
  { text: "Sleep in on Saturday", cost: 0 },
  { text: "New book from wishlist 📚", cost: 20 },
  { text: "Fancy dinner out 🍽️", cost: 100 },
  { text: "Spa day or massage 💆", cost: 150 },
  { text: "Concert or show tickets 🎵", cost: 120 },
  { text: "New clothes shopping spree 👔", cost: 200 },
  { text: "Weekend getaway 🏖️", cost: 500 },
  { text: "New gadget or tech 📱", cost: 300 },
  { text: "Guilt-free gaming day 🎮", cost: 0 },
  { text: "Order favorite takeout 🍕", cost: 40 },
  { text: "Buy fresh flowers 💐", cost: 30 },
  { text: "New workout gear 🏃", cost: 80 },
  { text: "Art supplies or hobby items 🎨", cost: 60 }
]

export default function RewardsPage() {
  const { rewards, addReward, updateReward, deleteReward, isBlue } = useDashboard()
  const [text, setText] = useState('')
  const [cost, setCost] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof REWARD_SUGGESTIONS>([])

  const totalValue = rewards.reduce((sum, r) => sum + (Number(r.cost) || 0), 0)
  const earnedValue = rewards.filter(r => r.earned).reduce((sum, r) => sum + (Number(r.cost) || 0), 0)
  const earnedCount = rewards.filter(r => r.earned).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    await addReward({
      text: text.trim(),
      cost: parseFloat(cost) || 0,
    })

    setText('')
    setCost('')
  }

  const toggleEarned = async (id: string, currentlyEarned: boolean) => {
    await updateReward(id, { earned: !currentlyEarned })
  }

  const regenerateSuggestions = () => {
    const shuffled = [...REWARD_SUGGESTIONS].sort(() => Math.random() - 0.5)
    setSuggestions(shuffled.slice(0, 5))
  }

  const openSuggestions = () => {
    regenerateSuggestions()
    setShowSuggestions(true)
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

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
          <h2 className="font-serif text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-1">
            🎁 Rewards
          </h2>
          <p className="text-sm text-purple-600/70 dark:text-purple-500/70">
            Celebrate your wins with well-deserved treats
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <p className="text-2xl font-semibold text-purple-700 dark:text-purple-400">{rewards.length}</p>
            <p className="text-xs text-purple-600/70 dark:text-purple-500/70">Total Rewards</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
            <p className="text-2xl font-semibold text-green-700 dark:text-green-400">{earnedCount}</p>
            <p className="text-xs text-green-600/70 dark:text-green-500/70">Earned</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">${earnedValue}</p>
            <p className="text-xs text-amber-600/70 dark:text-amber-500/70">of ${totalValue}</p>
          </div>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a reward..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="$"
            className="w-20 px-3 py-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
            min="0"
          />
          <button
            type="button"
            onClick={openSuggestions}
            className="p-2.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Sparkles size={20} />
          </button>
          <button
            type="submit"
            className={`px-4 py-2.5 rounded-lg text-white ${gradientClass} hover:opacity-90`}
          >
            <Plus size={20} />
          </button>
        </form>

        {/* Rewards List */}
        <div className="space-y-2">
          {rewards.length === 0 ? (
            <div className="text-center py-12 text-purple-600/50 dark:text-purple-500/50">
              <span className="text-4xl">🎁</span>
              <p className="mt-2">Add rewards to earn</p>
            </div>
          ) : (
            rewards.map(reward => (
              <div
                key={reward.id}
                className={`group flex items-center gap-3 p-3 rounded-lg border ${
                  reward.earned
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-purple-800/50'
                }`}
              >
                <button
                  onClick={() => toggleEarned(reward.id, reward.earned)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    reward.earned
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-purple-300 dark:border-purple-600'
                  }`}
                >
                  {reward.earned && <Check size={12} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`${reward.earned ? 'line-through text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                    {reward.text}
                  </p>
                </div>
                {Number(reward.cost) > 0 && (
                  <span className="text-sm text-purple-500 dark:text-purple-400 shrink-0">
                    ${Number(reward.cost).toLocaleString()}
                  </span>
                )}
                <button
                  onClick={() => deleteReward(reward.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-800/50 text-purple-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Suggestions Modal */}
        <Modal isOpen={showSuggestions} onClose={() => setShowSuggestions(false)} title="Reward Ideas ✨" size="sm">
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setText(s.text)
                  setCost(s.cost.toString())
                  setShowSuggestions(false)
                }}
                className="w-full text-left p-3 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex justify-between items-center"
              >
                <span className="text-slate-700 dark:text-slate-200">{s.text}</span>
                {s.cost > 0 && <span className="text-purple-500">${s.cost}</span>}
              </button>
            ))}
          </div>
          <button
            onClick={regenerateSuggestions}
            className="w-full mt-3 py-2 rounded-lg border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center justify-center gap-2"
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
