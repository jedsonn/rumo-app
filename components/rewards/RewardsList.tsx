'use client'

import { useState, useMemo } from 'react'
import { Reward, Goal } from '@/lib/types'
import { Gift, Plus, Trash2, Sparkles, Check, DollarSign } from 'lucide-react'

interface RewardsListProps {
  rewards: Reward[]
  goals: Goal[]
  onAddReward: (text: string, cost: number) => void
  onUpdateReward: (reward: Reward) => void
  onDeleteReward: (id: string) => void
  onOpenSuggestions: () => void
  isDark: boolean
}

// RewardsList - emerald themed rewards list (matches template EXACTLY)
export function RewardsList({
  rewards,
  goals,
  onAddReward,
  onUpdateReward,
  onDeleteReward,
  onOpenSuggestions,
  isDark
}: RewardsListProps) {
  const [newReward, setNewReward] = useState('')
  const [newCost, setNewCost] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReward.trim()) return
    onAddReward(newReward.trim(), parseInt(newCost) || 0)
    setNewReward('')
    setNewCost('')
  }

  // Calculate total points earned from completed goals
  const earnedPoints = useMemo(() => {
    return goals
      .filter(g => g.status === 'Done')
      .reduce((sum, g) => sum + g.cost, 0)
  }, [goals])

  // Calculate spent points on earned rewards
  const spentPoints = useMemo(() => {
    return rewards
      .filter(r => r.earned)
      .reduce((sum, r) => sum + r.cost, 0)
  }, [rewards])

  const availablePoints = earnedPoints - spentPoints

  const earnedRewards = rewards.filter(r => r.earned)
  const unearnedRewards = rewards.filter(r => !r.earned)

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border overflow-hidden ${
        isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Emerald Header */}
      <div
        className={`p-4 border-b flex-shrink-0 ${
          isDark
            ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-800/50'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-500'} />
            <h2
              className={`font-serif font-bold text-lg ${
                isDark
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
              }`}
            >
              Rewards
            </h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark
                  ? 'bg-emerald-900/50 text-emerald-400'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {rewards.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                availablePoints >= 0
                  ? (isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                  : (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600')
              }`}
            >
              <DollarSign size={12} />
              {availablePoints.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Points Summary */}
        <div className="flex gap-3 text-[9px] uppercase font-bold mb-3">
          <span className="text-emerald-500">Earned: ${earnedPoints.toLocaleString()}</span>
          <span className="text-orange-500">Spent: ${spentPoints.toLocaleString()}</span>
        </div>

        {/* Add Reward Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newReward}
            onChange={(e) => setNewReward(e.target.value)}
            placeholder="Add a reward..."
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm border ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500'
                : 'bg-white border-emerald-200 text-slate-800 placeholder-slate-400 focus:border-emerald-400'
            } outline-none`}
          />
          <input
            type="number"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            placeholder="Cost"
            className={`w-20 px-2 py-1.5 rounded-lg text-sm border text-center ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500'
                : 'bg-white border-emerald-200 text-slate-800 placeholder-slate-400 focus:border-emerald-400'
            } outline-none`}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg text-white ${
              isDark
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
            }`}
            title="Add reward"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={onOpenSuggestions}
            className="p-2 rounded-lg text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            title="Reward suggestions"
          >
            <Sparkles size={16} />
          </button>
        </form>
      </div>

      {/* Rewards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {rewards.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Gift size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Treat yourself</p>
            <p className="text-xs mt-1">Add rewards to earn</p>
          </div>
        ) : (
          <>
            {/* Available Rewards */}
            {unearnedRewards.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Available ({unearnedRewards.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {unearnedRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      onToggleEarned={() => onUpdateReward({ ...reward, earned: true })}
                      onDelete={() => onDeleteReward(reward.id)}
                      canAfford={availablePoints >= reward.cost}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Earned Rewards */}
            {earnedRewards.length > 0 && (
              <div className={unearnedRewards.length > 0 ? 'mt-4' : ''}>
                <div className="flex items-center gap-2 mb-2">
                  <Check size={12} className="text-emerald-500" />
                  <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Earned ({earnedRewards.length})
                  </span>
                </div>
                <div className="space-y-1 opacity-60">
                  {earnedRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      onToggleEarned={() => onUpdateReward({ ...reward, earned: false })}
                      onDelete={() => onDeleteReward(reward.id)}
                      canAfford={true}
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

// RewardCard - individual reward item (matches template)
function RewardCard({
  reward,
  onToggleEarned,
  onDelete,
  canAfford,
  isDark
}: {
  reward: Reward
  onToggleEarned: () => void
  onDelete: () => void
  canAfford: boolean
  isDark: boolean
}) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-sm ${
        reward.earned
          ? (isDark ? 'bg-emerald-900/30 border-emerald-700/50' : 'bg-emerald-50 border-emerald-200')
          : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
      }`}
    >
      <button
        onClick={onToggleEarned}
        className={`p-1 rounded-full transition-colors ${
          reward.earned
            ? 'bg-emerald-500 text-white'
            : canAfford
              ? (isDark ? 'bg-slate-700 hover:bg-emerald-800 text-slate-400 hover:text-emerald-400' : 'bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600')
              : (isDark ? 'bg-slate-700 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-300 cursor-not-allowed')
        }`}
        title={reward.earned ? 'Mark as not earned' : canAfford ? 'Mark as earned' : 'Not enough points'}
        disabled={!canAfford && !reward.earned}
      >
        <Check size={12} />
      </button>
      <p
        className={`flex-1 text-sm ${
          reward.earned
            ? 'line-through ' + (isDark ? 'text-slate-400' : 'text-slate-500')
            : (isDark ? 'text-slate-200' : 'text-slate-700')
        }`}
      >
        {reward.text}
      </p>
      {reward.cost > 0 && (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
          }`}
        >
          ${reward.cost.toLocaleString()}
        </span>
      )}
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
