'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Header, TabType } from '@/components/ui/Header'
import { GoalsColumn } from '@/components/goals/GoalsColumn'
import { TemplatesModal } from '@/components/goals/TemplatesModal'
import { Toast } from '@/components/ui/Toast'
import { VisionBoard } from '@/components/vision/VisionBoard'
import { YearEndReview } from '@/components/review/YearEndReview'
import { QuoteDisplay } from '@/components/motivation/QuoteDisplay'
import { GoalTemplate } from '@/lib/templates'
import { FocusMode } from '@/lib/types'
import { Plus, Trash2, Sparkles, Check, GripVertical } from 'lucide-react'

// Blessing suggestions
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

// Reward suggestions
const REWARD_SUGGESTIONS = [
  { text: "Nice specialty coffee", cost: 8 },
  { text: "Movie night with popcorn", cost: 25 },
  { text: "Sleep in on Saturday", cost: 0 },
  { text: "New book from wishlist", cost: 20 },
  { text: "Fancy dinner out", cost: 100 },
  { text: "Spa day or massage", cost: 150 },
  { text: "Concert or show tickets", cost: 120 },
  { text: "New clothes shopping spree", cost: 200 },
  { text: "Weekend getaway", cost: 500 },
  { text: "New gadget or tech", cost: 300 },
]

export default function DashboardPage() {
  const {
    goals,
    blessings,
    rewards,
    visionBoardItems,
    quotes,
    year,
    isBlue,
    columnSplit,
    setColumnSplit,
    focusMode,
    loading,
    addGoal,
    addBlessing,
    deleteBlessing,
    addReward,
    updateReward,
    deleteReward,
    addVisionBoardItem,
    updateVisionBoardItem,
    deleteVisionBoardItem,
    showToast,
  } = useDashboard()

  const [activeTab, setActiveTab] = useState<TabType>('goals')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track recently completed goals to delay their repositioning (5 second delay)
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<Set<string>>(new Set())
  const prevGoalsRef = useRef<typeof goals>([])

  // Detect when a goal is marked as Done and add it to recentlyCompleted
  useEffect(() => {
    const prevGoals = prevGoalsRef.current
    goals.forEach(goal => {
      const prevGoal = prevGoals.find(g => g.id === goal.id)
      if (prevGoal && prevGoal.status !== 'Done' && goal.status === 'Done') {
        // Goal was just marked as Done
        setRecentlyCompletedIds(prev => {
          const next = new Set(Array.from(prev))
          next.add(goal.id)
          return next
        })
        // Remove from recentlyCompleted after 5 seconds
        setTimeout(() => {
          setRecentlyCompletedIds(prev => {
            const next = new Set(Array.from(prev))
            next.delete(goal.id)
            return next
          })
        }, 5000)
      }
    })
    prevGoalsRef.current = goals
  }, [goals])

  // Modal states
  const [showStats, setShowStats] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [showClearAll, setShowClearAll] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // Blessing/Reward form states
  const [blessingValue, setBlessingValue] = useState('')
  const [rewardText, setRewardText] = useState('')
  const [rewardCost, setRewardCost] = useState('')

  // Apply focus mode filter
  const applyFocusModeFilter = (goalsList: typeof goals, mode: FocusMode) => {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    switch (mode) {
      case 'active':
        return goalsList.filter(g => ['Doing', 'On Track'].includes(g.status))
      case 'pinned':
        return goalsList.filter(g => g.pinned)
      case 'stale':
        return goalsList.filter(g => {
          const updatedAt = new Date(g.updated_at)
          return updatedAt < twoWeeksAgo && g.status !== 'Done' && g.status !== 'Dropped'
        })
      case 'this-week':
        const weekFromNow = new Date()
        weekFromNow.setDate(weekFromNow.getDate() + 7)
        return goalsList.filter(g => {
          if (!g.due_date) return false
          const dueDate = new Date(g.due_date)
          return dueDate <= weekFromNow && g.status !== 'Done'
        })
      default:
        return goalsList
    }
  }

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
    let result = goals.filter(g => g.year === year)

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(g => g.goal.toLowerCase().includes(searchLower))
    }

    if (statusFilter === 'active') {
      result = result.filter(g => ['Doing', 'On Track'].includes(g.status))
    } else if (statusFilter === 'done') {
      result = result.filter(g => g.status === 'Done')
    } else if (statusFilter === 'dropped') {
      result = result.filter(g => g.status === 'Dropped')
    }

    if (periodFilter !== 'all') {
      result = result.filter(g => g.period === periodFilter)
    }

    // Apply focus mode
    result = applyFocusModeFilter(result, focusMode)

    // Sort: pinned first, then by status priority, then by number
    // BUT keep recently completed goals at their position for 5 seconds
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      // If a goal was recently completed, treat it as still active for sorting purposes
      const aStatus = recentlyCompletedIds.has(a.id) && a.status === 'Done' ? 'Doing' : a.status
      const bStatus = recentlyCompletedIds.has(b.id) && b.status === 'Done' ? 'Doing' : b.status

      const statusOrder: Record<string, number> = { 'Doing': 0, 'On Track': 1, 'For Later': 2, 'Done': 3, 'Dropped': 4 }
      const statusDiff = statusOrder[aStatus] - statusOrder[bStatus]
      if (statusDiff !== 0) return statusDiff

      return a.number - b.number
    })

    return result
  }, [goals, year, search, statusFilter, periodFilter, focusMode, recentlyCompletedIds])

  // Resizer handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newSplit = ((e.clientX - rect.left) / rect.width) * 100
    setColumnSplit(Math.max(20, Math.min(80, newSplit)))
  }, [isResizing, setColumnSplit])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus()
      }
      if (e.key === 'Escape') {
        setShowStats(false)
        setShowReview(false)
        setShowImportExport(false)
        setShowClearAll(false)
        setShowTemplates(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle adding goals from templates
  const handleAddGoalsFromTemplates = async (templates: GoalTemplate[]) => {
    for (const template of templates) {
      const categoryGoals = goals.filter(g => g.category === template.category)
      const maxNum = Math.max(0, ...categoryGoals.map(g => g.number))

      await addGoal({
        number: maxNum + 1,
        year,
        goal: template.goal,
        period: template.period,
        category: template.category,
        status: 'Doing',
        action: template.action,
        cost: 0,
        notes: null,
        pinned: false,
        linked_reward_id: null,
      })
    }
    showToast(`Added ${templates.length} goals from template!`)
  }

  // Blessing handlers
  const handleAddBlessing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blessingValue.trim()) return
    await addBlessing({ text: blessingValue.trim(), category: 'Personal' })
    setBlessingValue('')
  }

  const suggestBlessing = () => {
    const available = BLESSING_SUGGESTIONS.filter(s => !blessings.some(b => b.text === s))
    if (available.length > 0) {
      setBlessingValue(available[Math.floor(Math.random() * available.length)])
    }
  }

  // Reward handlers
  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rewardText.trim()) return
    await addReward({ text: rewardText.trim(), cost: parseFloat(rewardCost) || 0 })
    setRewardText('')
    setRewardCost('')
  }

  const suggestReward = () => {
    const available = REWARD_SUGGESTIONS.filter(s => !rewards.some(r => r.text === s.text))
    if (available.length > 0) {
      const suggestion = available[Math.floor(Math.random() * available.length)]
      setRewardText(suggestion.text)
      setRewardCost(suggestion.cost.toString())
    }
  }

  const toggleRewardEarned = async (id: string, earned: boolean) => {
    await updateReward(id, { earned: !earned })
  }

  // Reset filters when a goal is added so the new goal is visible
  const handleGoalAdded = useCallback(() => {
    if (statusFilter !== 'all' || periodFilter !== 'all' || focusMode !== 'all') {
      setStatusFilter('all')
      setPeriodFilter('all')
    }
  }, [statusFilter, periodFilter, focusMode])

  // Stats calculations
  const rewardStats = useMemo(() => ({
    total: rewards.length,
    earned: rewards.filter(r => r.earned).length,
    totalValue: rewards.reduce((sum, r) => sum + (Number(r.cost) || 0), 0),
    earnedValue: rewards.filter(r => r.earned).reduce((sum, r) => sum + (Number(r.cost) || 0), 0),
  }), [rewards])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <p className="text-slate-500">Loading your goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header
        onShowStats={() => setShowStats(true)}
        onShowReview={() => setShowReview(true)}
        onShowImportExport={() => setShowImportExport(true)}
        onShowClearAll={() => setShowClearAll(true)}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 pb-16">
        {/* Motivational Quote - show on all tabs */}
        {quotes.length > 0 && (
          <div className="mb-4">
            <QuoteDisplay quotes={quotes} compact />
          </div>
        )}

        {activeTab === 'goals' && (
          <>
            {/* Desktop: Two columns with resizer */}
            <div
              ref={containerRef}
              className="hidden md:flex gap-0 h-[calc(100vh-200px)] relative"
            >
              {/* Personal Column */}
              <div style={{ width: `${columnSplit}%` }} className="pr-1 overflow-hidden">
                <GoalsColumn category="Personal" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} onGoalAdded={handleGoalAdded} />
              </div>

              {/* Resizer */}
              <div
                onMouseDown={handleMouseDown}
                onDoubleClick={() => setColumnSplit(50)}
                title="Drag to resize • Double-click to reset 50/50"
                className={`w-3 cursor-col-resize flex-shrink-0 group relative hidden lg:flex items-center justify-center ${isResizing ? 'select-none' : ''}`}
              >
                <div className={`w-1 h-full rounded-full transition-all ${
                  isResizing
                    ? (isBlue ? 'bg-blue-500' : 'bg-rose-500')
                    : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
                }`} />
                <div className={`absolute top-1/2 -translate-y-1/2 px-1.5 py-1 rounded flex flex-col items-center justify-center transition-opacity ${
                  isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } bg-slate-200 dark:bg-slate-700`}>
                  <GripVertical size={14} className="text-slate-400 dark:text-slate-500" />
                  <span className="text-[8px] font-bold mt-1 text-slate-500 dark:text-slate-400">
                    {Math.round(columnSplit)}:{Math.round(100-columnSplit)}
                  </span>
                </div>
              </div>

              {/* Professional Column */}
              <div style={{ width: `${100 - columnSplit}%` }} className="pl-1 overflow-hidden">
                <GoalsColumn category="Professional" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} onGoalAdded={handleGoalAdded} />
              </div>
            </div>

            {/* Mobile: Stacked columns */}
            <div className="md:hidden space-y-6">
              <div className="min-h-[40vh]">
                <GoalsColumn category="Personal" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} onGoalAdded={handleGoalAdded} />
              </div>
              <div className="min-h-[40vh]">
                <GoalsColumn category="Professional" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} onGoalAdded={handleGoalAdded} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'vision' && (
          <div className="h-[calc(100vh-200px)]">
            <VisionBoard
              items={visionBoardItems}
              onAddItem={addVisionBoardItem}
              onUpdateItem={updateVisionBoardItem}
              onDeleteItem={deleteVisionBoardItem}
            />
          </div>
        )}

        {activeTab === 'blessings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/50 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-amber-100 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-serif font-bold text-lg text-amber-700 dark:text-amber-400">Blessings</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-white dark:bg-slate-700 text-amber-500 border-amber-200 dark:border-amber-800">
                    {blessings.length}
                  </span>
                </div>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Count your blessings, not your problems</p>
              </div>

              {/* Add Form */}
              <div className="p-3 border-b border-amber-100 dark:border-amber-900/50">
                <form onSubmit={handleAddBlessing} className="flex gap-2">
                  <input
                    type="text"
                    value={blessingValue}
                    onChange={(e) => setBlessingValue(e.target.value)}
                    placeholder="What are you grateful for?"
                    className="flex-1 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-400 outline-none text-sm"
                  />
                  <button type="submit" className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90">
                    <Plus size={20} />
                  </button>
                  <button type="button" onClick={suggestBlessing} className="p-2 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:opacity-90" title="Suggest">
                    <Sparkles size={20} />
                  </button>
                </form>
              </div>

              {/* Blessings List */}
              <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
                {blessings.length === 0 ? (
                  <div className="text-center py-16 text-amber-400/50 dark:text-amber-500/50">
                    <span className="text-4xl">*</span>
                    <p className="mt-2 text-sm">Add your first blessing!</p>
                  </div>
                ) : (
                  blessings.map(b => (
                    <div key={b.id} className="group p-3 rounded-xl border border-amber-100 dark:border-amber-800/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 hover:shadow-md">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {new Date(b.created_at).toLocaleDateString()}
                          </span>
                          <p className="text-sm text-slate-700 dark:text-slate-200">{b.text}</p>
                        </div>
                        <button
                          onClick={() => deleteBlessing(b.id)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-900/50 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-serif font-bold text-lg text-purple-700 dark:text-purple-400">Rewards</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-white dark:bg-slate-700 text-purple-500 border-purple-200 dark:border-purple-800">
                    {rewardStats.total}
                  </span>
                  {rewardStats.earned > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                      {rewardStats.earned} earned
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Treat yourself when you achieve your goals!</p>
                <div className="text-[10px] mt-1 text-slate-400 dark:text-slate-500">
                  Total: ${rewardStats.totalValue.toLocaleString()} | Earned: ${rewardStats.earnedValue.toLocaleString()}
                </div>
              </div>

              {/* Add Form */}
              <div className="p-3 border-b border-purple-100 dark:border-purple-900/50">
                <form onSubmit={handleAddReward} className="flex gap-2">
                  <input
                    type="text"
                    value={rewardText}
                    onChange={(e) => setRewardText(e.target.value)}
                    placeholder="Add a reward..."
                    className="flex-1 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={rewardCost}
                    onChange={(e) => setRewardCost(e.target.value)}
                    placeholder="$"
                    className="w-16 px-2 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                    min="0"
                  />
                  <button type="submit" className={`p-2 rounded-xl text-white ${isBlue ? 'gradient-bg' : 'gradient-bg-pink'} hover:opacity-90`}>
                    <Plus size={20} />
                  </button>
                  <button type="button" onClick={suggestReward} className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90" title="Suggest">
                    <Sparkles size={20} />
                  </button>
                </form>
              </div>

              {/* Rewards List */}
              <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
                {rewards.length === 0 ? (
                  <div className="text-center py-16 text-purple-400/50 dark:text-purple-500/50">
                    <span className="text-4xl">*</span>
                    <p className="mt-2 text-sm">Add rewards to motivate yourself!</p>
                  </div>
                ) : (
                  rewards.map(r => (
                    <div key={r.id} className={`group px-3 py-2 rounded-xl border hover:shadow-md transition-all ${
                      r.earned
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRewardEarned(r.id, r.earned)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            r.earned
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500'
                          }`}
                          title={r.earned ? "Mark as not earned" : "Mark as earned!"}
                        >
                          {r.earned && <Check size={12} />}
                        </button>
                        <p className={`flex-1 text-sm ${r.earned ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                          {r.text}
                        </p>
                        {Number(r.cost) > 0 && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                            ${Number(r.cost).toLocaleString()}
                          </span>
                        )}
                        <button
                          onClick={() => deleteReward(r.id)}
                          className="p-1 opacity-0 group-hover:opacity-100 text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-slate-400">
          <div className="w-5 h-5 rounded gradient-bg flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <span className={isBlue ? 'gradient-text font-bold' : 'gradient-text-pink font-bold'}>Rumo</span>
          <span>-</span>
          <span>Set your direction</span>
        </div>
      </footer>

      {/* Toast */}
      <Toast />

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onAddGoals={handleAddGoalsFromTemplates}
        isBlue={isBlue}
      />

      {/* Year-End Review Modal */}
      <YearEndReview
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        year={year}
      />
    </div>
  )
}
