'use client'

import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Goal, Blessing, Reward } from '@/lib/types'
import { Twitter, Linkedin, Link2, Check, Trophy, Target, Star, TrendingUp } from 'lucide-react'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  goals: Goal[]
  blessings: Blessing[]
  rewards: Reward[]
  ownerName: string
  year: number
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

export function ReviewModal({
  isOpen,
  onClose,
  goals,
  blessings,
  rewards,
  ownerName,
  year,
  themeColor,
  isDark
}: ReviewModalProps) {
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    const yearGoals = goals.filter(g => g.year === year)
    const done = yearGoals.filter(g => g.status === 'Done')
    const active = yearGoals.filter(g => ['Doing', 'On Track'].includes(g.status))
    const personal = yearGoals.filter(g => g.category === 'Personal')
    const professional = yearGoals.filter(g => g.category === 'Professional')
    const personalDone = done.filter(g => g.category === 'Personal')
    const professionalDone = done.filter(g => g.category === 'Professional')

    return {
      total: yearGoals.length,
      done: done.length,
      active: active.length,
      progress: yearGoals.length ? Math.round((done.length / yearGoals.length) * 100) : 0,
      personal: personal.length,
      professional: professional.length,
      personalDone: personalDone.length,
      professionalDone: professionalDone.length,
      blessings: blessings.length,
      rewards: rewards.length,
      earnedRewards: rewards.filter(r => r.earned).length,
      topGoals: done.slice(0, 3),
    }
  }, [goals, blessings, rewards, year])

  const shareText = `🎯 My ${year} Year in Review:\n\n✅ ${stats.done}/${stats.total} resolutions completed (${stats.progress}%)\n🙏 ${stats.blessings} blessings counted\n🎁 ${stats.earnedRewards} rewards earned\n\n#${year}InReview #Goals #Resolutions`
  const encodedText = encodeURIComponent(shareText)
  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodedText}`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const gradientClass = themeColor === 'blue'
    ? 'from-blue-500 via-violet-500 to-purple-500'
    : 'from-rose-500 via-pink-500 to-fuchsia-500'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${year} Year in Review`} size="lg">
      <div className="space-y-6">
        {/* Hero Card */}
        <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${gradientClass} text-white overflow-hidden`}>
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-8xl">🎯</div>
            <div className="absolute bottom-4 left-4 text-6xl">✨</div>
            <div className="absolute top-1/2 right-1/4 text-4xl">🏆</div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">{ownerName}'s {year}</h2>
              <p className="text-white/80">Year in Review</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold">{stats.done}</div>
                <div className="text-sm text-white/80">Completed</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold">{stats.progress}%</div>
                <div className="text-sm text-white/80">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold">{stats.total}</div>
                <div className="text-sm text-white/80">Total Goals</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{stats.done}/{stats.total} goals</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">👤 Personal</span>
                </div>
                <div className="text-lg font-bold">{stats.personalDone}/{stats.personal}</div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">💼 Professional</span>
                </div>
                <div className="text-lg font-bold">{stats.professionalDone}/{stats.professional}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="text-3xl mb-1">🙏</div>
            <div className={`text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {stats.blessings}
            </div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Blessings
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="text-3xl mb-1">🎁</div>
            <div className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {stats.earnedRewards}
            </div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Rewards Earned
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="text-3xl mb-1">📈</div>
            <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {stats.active}
            </div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              In Progress
            </div>
          </div>
        </div>

        {/* Top Completed Goals */}
        {stats.topGoals.length > 0 && (
          <div>
            <h3 className={`text-sm font-bold uppercase mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              🏆 Top Achievements
            </h3>
            <div className="space-y-2">
              {stats.topGoals.map((goal, i) => (
                <div
                  key={goal.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
                >
                  <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                  <span className={`flex-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {goal.goal}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                    {goal.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Share your year in review:
          </p>

          <div className="flex gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
            >
              <Twitter size={20} />
              <span className="font-medium">Twitter</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0077B5] text-white hover:bg-[#006399] transition-colors"
            >
              <Linkedin size={20} />
              <span className="font-medium">LinkedIn</span>
            </a>
          </div>

          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} className="text-green-500" />
                <span className="font-medium text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Link2 size={20} />
                <span className="font-medium">Copy summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
