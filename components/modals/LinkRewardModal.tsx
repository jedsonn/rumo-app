'use client'

import { Goal, Reward } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import { Gift, Check, X } from 'lucide-react'

interface LinkRewardModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  rewards: Reward[]
  onLinkReward: (goalId: string, rewardId: string | null) => void
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// LinkRewardModal - select a reward to link to goal (matches template EXACTLY)
export function LinkRewardModal({
  isOpen,
  onClose,
  goal,
  rewards,
  onLinkReward,
  themeColor,
  isDark
}: LinkRewardModalProps) {
  if (!goal) return null

  const handleSelect = (rewardId: string | null) => {
    onLinkReward(goal.id, rewardId)
    onClose()
  }

  const gradientClass = themeColor === 'blue' ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link Reward to Goal">
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Goal: {goal.goal}
          </p>
          {goal.linked_reward_id && (
            <p className={`text-xs mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Currently linked to a reward
            </p>
          )}
        </div>

        {rewards.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Gift size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No rewards available</p>
            <p className="text-xs mt-1">Add rewards in the Rewards tab first</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {/* Option to remove link */}
            {goal.linked_reward_id && (
              <button
                onClick={() => handleSelect(null)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isDark
                    ? 'border-red-700 bg-red-900/20 hover:bg-red-900/30 text-red-400'
                    : 'border-red-200 bg-red-50 hover:bg-red-100 text-red-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <X size={18} />
                  <span>Remove reward link</span>
                </div>
              </button>
            )}

            {/* Reward options */}
            {rewards.map(reward => {
              const isLinked = goal.linked_reward_id === reward.id
              return (
                <button
                  key={reward.id}
                  onClick={() => handleSelect(reward.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isLinked
                      ? (isDark ? 'border-emerald-500 bg-emerald-900/30' : 'border-emerald-300 bg-emerald-50')
                      : (isDark
                          ? 'border-slate-700 hover:border-slate-600 bg-slate-800'
                          : 'border-slate-200 hover:border-slate-300 bg-white')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isLinked
                          ? 'bg-emerald-500 text-white'
                          : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')
                      }`}
                    >
                      {isLinked ? <Check size={14} /> : <Gift size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {reward.text}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {reward.cost > 0 && (
                          <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            ${reward.cost.toLocaleString()}
                          </span>
                        )}
                        {reward.earned && (
                          <span className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                            ✓ Earned
                          </span>
                        )}
                      </div>
                    </div>
                    {isLinked && (
                      <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        Linked
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
