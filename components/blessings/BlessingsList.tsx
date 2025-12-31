'use client'

import { useState } from 'react'
import { Blessing, GoalCategory } from '@/lib/types'
import { Sparkles, Plus, Trash2, User, Briefcase, Heart } from 'lucide-react'

interface BlessingsListProps {
  blessings: Blessing[]
  onAddBlessing: (text: string, category: GoalCategory) => void
  onDeleteBlessing: (id: string) => void
  onOpenSuggestions: () => void
  isDark: boolean
}

// BlessingsList - amber themed gratitude list (matches template EXACTLY)
export function BlessingsList({
  blessings,
  onAddBlessing,
  onDeleteBlessing,
  onOpenSuggestions,
  isDark
}: BlessingsListProps) {
  const [newBlessing, setNewBlessing] = useState('')
  const [category, setCategory] = useState<GoalCategory>('Personal')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlessing.trim()) return
    onAddBlessing(newBlessing.trim(), category)
    setNewBlessing('')
  }

  const personalBlessings = blessings.filter(b => b.category === 'Personal')
  const professionalBlessings = blessings.filter(b => b.category === 'Professional')

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border overflow-hidden ${
        isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Amber Header */}
      <div
        className={`p-4 border-b flex-shrink-0 ${
          isDark
            ? 'bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-amber-800/50'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
          <h2
            className={`font-serif font-bold text-lg ${
              isDark
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'
            }`}
          >
            Blessings
          </h2>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDark
                ? 'bg-amber-900/50 text-amber-400'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {blessings.length}
          </span>
        </div>

        {/* Add Blessing Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newBlessing}
              onChange={(e) => setNewBlessing(e.target.value)}
              placeholder="What are you grateful for..."
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm border ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500'
                  : 'bg-white border-amber-200 text-slate-800 placeholder-slate-400 focus:border-amber-400'
              } outline-none`}
            />
            <div className="flex rounded-lg overflow-hidden border border-amber-300 dark:border-amber-700">
              <button
                type="button"
                onClick={() => setCategory('Personal')}
                className={`p-1.5 ${
                  category === 'Personal'
                    ? (isDark ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-700')
                    : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-400')
                }`}
                title="Personal"
              >
                <User size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCategory('Professional')}
                className={`p-1.5 ${
                  category === 'Professional'
                    ? (isDark ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-700')
                    : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-400')
                }`}
                title="Professional"
              >
                <Briefcase size={14} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`p-2 rounded-lg text-white ${
              isDark
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
            }`}
            title="Add blessing"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={onOpenSuggestions}
            className="p-2 rounded-lg text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            title="Blessing suggestions"
          >
            <Sparkles size={16} />
          </button>
        </form>
      </div>

      {/* Blessings List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {blessings.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Heart size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Count your blessings</p>
            <p className="text-xs mt-1">Add what you're grateful for</p>
          </div>
        ) : (
          <>
            {/* Personal Blessings */}
            {personalBlessings.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User size={12} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                  <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    Personal ({personalBlessings.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {personalBlessings.map((blessing) => (
                    <BlessingCard
                      key={blessing.id}
                      blessing={blessing}
                      onDelete={() => onDeleteBlessing(blessing.id)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Professional Blessings */}
            {professionalBlessings.length > 0 && (
              <div className={personalBlessings.length > 0 ? 'mt-4' : ''}>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={12} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                  <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    Professional ({professionalBlessings.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {professionalBlessings.map((blessing) => (
                    <BlessingCard
                      key={blessing.id}
                      blessing={blessing}
                      onDelete={() => onDeleteBlessing(blessing.id)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// BlessingCard - individual blessing item (matches template)
function BlessingCard({
  blessing,
  onDelete,
  isDark
}: {
  blessing: Blessing
  onDelete: () => void
  isDark: boolean
}) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-sm ${
        isDark
          ? 'bg-slate-800 border-slate-700 hover:border-amber-700/50'
          : 'bg-white border-slate-200 hover:border-amber-200'
      }`}
    >
      <span className="text-amber-500 text-sm">✨</span>
      <p className={`flex-1 text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
        {blessing.text}
      </p>
      <button
        onClick={onDelete}
        className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isDark ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-500'
        }`}
        title="Delete"
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}
