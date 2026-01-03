'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Header, TabType } from '@/components/ui/Header'
import { GoalList } from '@/components/goals/GoalList'
import { BlessingsList } from '@/components/blessings/BlessingsList'
import { RewardsList } from '@/components/rewards/RewardsList'
import { ResizableDivider } from '@/components/ui/ResizableDivider'
import { Toast } from '@/components/ui/Toast'
import { EditGoalModal } from '@/components/goals/EditGoalModal'
import { SuggestionsModal } from '@/components/modals/SuggestionsModal'
import { LinkRewardModal } from '@/components/modals/LinkRewardModal'
import { ShareModal } from '@/components/modals/ShareModal'
import { ReviewModal } from '@/components/modals/ReviewModal'
import { ExportModal } from '@/components/modals/ExportModal'
import { SettingsModal } from '@/components/modals/SettingsModal'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { AIOnboardingModal } from '@/components/modals/AIOnboardingModal'
import { QuoteDisplay } from '@/components/motivation/QuoteDisplay'
import { ChatCoach } from '@/components/ai/ChatCoach'
import { Goal, GoalCategory, LifeStage, Priority, GoalPeriod } from '@/lib/types'
import { GoalSuggestion } from '@/lib/suggestions'

export default function DashboardPage() {
  const {
    profile,
    goals,
    blessings,
    rewards,
    quotes,
    year,
    isBlue,
    isDark,
    columnSplit,
    setColumnSplit,
    loading,
    recentlyChanged,
    addGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
    addBlessing,
    deleteBlessing,
    addReward,
    updateReward,
    deleteReward,
    showToast,
    updateProfile,
  } = useDashboard()

  // Tab and filter state
  const [activeTab, setActiveTab] = useState<TabType>('goals')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')

  // Modal states
  const [showStats, setShowStats] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [showClearAll, setShowClearAll] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [clearAllLoading, setClearAllLoading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Check if user needs onboarding
  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed && goals.length === 0) {
      setShowOnboarding(true)
    }
  }, [loading, profile, goals.length])

  // Goal modals
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [linkingGoal, setLinkingGoal] = useState<Goal | null>(null)
  const [sharingGoal, setSharingGoal] = useState<Goal | null>(null)

  // Suggestions modals
  const [suggestionsType, setSuggestionsType] = useState<'goal' | 'blessing' | 'reward' | null>(null)
  const [suggestionsCategory, setSuggestionsCategory] = useState<GoalCategory>('Personal')

  const themeColor = isBlue ? 'blue' : 'rose'

  // Filter goals
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
    }

    if (periodFilter !== 'all') {
      result = result.filter(g => g.period === periodFilter)
    }

    return result
  }, [goals, year, search, statusFilter, periodFilter])

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
        setShowSettings(false)
        setEditingGoal(null)
        setLinkingGoal(null)
        setSharingGoal(null)
        setSuggestionsType(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Goal handlers
  const handleAddGoal = useCallback(async (text: string, category: GoalCategory) => {
    const categoryGoals = goals.filter(g => g.category === category)
    const nextNum = Math.max(0, ...categoryGoals.map(g => g.number)) + 1

    await addGoal({
      number: nextNum,
      year,
      goal: text,
      period: 'One-year',
      category,
      status: 'Doing',
      action: null,
      cost: 0,
      notes: null,
      pinned: false,
      linked_reward_id: null,
    })

    // Reset filters so new goal is visible
    if (statusFilter !== 'all' || periodFilter !== 'all') {
      setStatusFilter('all')
      setPeriodFilter('all')
    }
  }, [goals, year, addGoal, statusFilter, periodFilter])

  const handleUpdateGoal = useCallback((goal: Goal) => {
    updateGoal(goal.id, goal)
  }, [updateGoal])

  const handleLinkReward = useCallback((goalId: string, rewardId: string | null) => {
    updateGoal(goalId, { linked_reward_id: rewardId })
    showToast(rewardId ? 'Reward linked!' : 'Reward unlinked')
  }, [updateGoal, showToast])

  // Suggestion handlers
  const handleAddGoalSuggestion = useCallback(async (suggestion: GoalSuggestion, category: GoalCategory) => {
    const categoryGoals = goals.filter(g => g.category === category)
    const nextNum = Math.max(0, ...categoryGoals.map(g => g.number)) + 1

    await addGoal({
      number: nextNum,
      year,
      goal: suggestion.goal,
      period: suggestion.period,
      category,
      status: 'Doing',
      action: suggestion.action,
      cost: 0,
      notes: null,
      pinned: false,
      linked_reward_id: null,
    })
  }, [goals, year, addGoal])

  const handleAddBlessingSuggestion = useCallback(async (text: string, category: GoalCategory) => {
    await addBlessing({ text, category })
  }, [addBlessing])

  const handleAddRewardSuggestion = useCallback(async (text: string, cost: number) => {
    await addReward({ text, cost, earned: false })
  }, [addReward])

  // Open suggestions modal
  const openGoalSuggestions = useCallback((category: GoalCategory) => {
    setSuggestionsCategory(category)
    setSuggestionsType('goal')
  }, [])

  const openBlessingSuggestions = useCallback(() => {
    setSuggestionsType('blessing')
  }, [])

  const openRewardSuggestions = useCallback(() => {
    setSuggestionsType('reward')
  }, [])

  // Handle AI onboarding completion
  const handleOnboardingComplete = useCallback(async (
    selectedGoals: { goal: string; action: string; period: GoalPeriod; category: GoalCategory }[],
    lifeStage: LifeStage,
    priorities: Priority[]
  ) => {
    // Save profile preferences
    await updateProfile({
      life_stage: lifeStage,
      priorities,
      onboarding_completed: true,
    })

    // Add selected goals
    for (const goalData of selectedGoals) {
      const categoryGoals = goals.filter(g => g.category === goalData.category)
      const existingNumbers = categoryGoals.map(g => g.number)
      const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1

      await addGoal({
        number: nextNum,
        year,
        goal: goalData.goal,
        period: goalData.period,
        category: goalData.category,
        status: 'Doing',
        action: goalData.action,
        cost: 0,
        notes: null,
        pinned: false,
        linked_reward_id: null,
      })
    }

    if (selectedGoals.length > 0) {
      showToast(`Added ${selectedGoals.length} goals!`)
    }
  }, [updateProfile, goals, year, addGoal, showToast])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse ${themeColor === 'blue' ? 'gradient-bg' : 'gradient-bg-pink'}`}>
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
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Header
        onShowStats={() => setShowStats(true)}
        onShowReview={() => setShowReview(true)}
        onShowImportExport={() => setShowImportExport(true)}
        onShowClearAll={() => setShowClearAll(true)}
        onShowSettings={() => setShowSettings(true)}
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
        {/* Motivational Quote */}
        {quotes.length > 0 && (
          <div className="mb-4">
            <QuoteDisplay quotes={quotes} compact />
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <>
            {/* Desktop: Two columns with resizer */}
            <div className="hidden md:flex gap-0 h-[calc(100vh-200px)] relative">
              {/* Personal Column */}
              <div style={{ width: `${columnSplit}%` }} className="pr-1 overflow-hidden">
                <GoalList
                  category="Personal"
                  goals={filteredGoals}
                  rewards={rewards}
                  onAddGoal={(text) => handleAddGoal(text, 'Personal')}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={deleteGoal}
                  onLinkReward={setLinkingGoal}
                  onEditGoal={setEditingGoal}
                  onShareGoal={setSharingGoal}
                  onOpenSuggestions={() => openGoalSuggestions('Personal')}
                  recentlyChanged={recentlyChanged}
                  themeColor={themeColor}
                  isDark={isDark}
                />
              </div>

              {/* Resizer */}
              <ResizableDivider
                split={columnSplit}
                onSplitChange={setColumnSplit}
                themeColor={themeColor}
                isDark={isDark}
              />

              {/* Professional Column */}
              <div style={{ width: `${100 - columnSplit}%` }} className="pl-1 overflow-hidden">
                <GoalList
                  category="Professional"
                  goals={filteredGoals}
                  rewards={rewards}
                  onAddGoal={(text) => handleAddGoal(text, 'Professional')}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={deleteGoal}
                  onLinkReward={setLinkingGoal}
                  onEditGoal={setEditingGoal}
                  onShareGoal={setSharingGoal}
                  onOpenSuggestions={() => openGoalSuggestions('Professional')}
                  recentlyChanged={recentlyChanged}
                  themeColor={themeColor}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Mobile: Stacked columns */}
            <div className="md:hidden space-y-6">
              <div className="min-h-[40vh]">
                <GoalList
                  category="Personal"
                  goals={filteredGoals}
                  rewards={rewards}
                  onAddGoal={(text) => handleAddGoal(text, 'Personal')}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={deleteGoal}
                  onLinkReward={setLinkingGoal}
                  onEditGoal={setEditingGoal}
                  onShareGoal={setSharingGoal}
                  onOpenSuggestions={() => openGoalSuggestions('Personal')}
                  recentlyChanged={recentlyChanged}
                  themeColor={themeColor}
                  isDark={isDark}
                />
              </div>
              <div className="min-h-[40vh]">
                <GoalList
                  category="Professional"
                  goals={filteredGoals}
                  rewards={rewards}
                  onAddGoal={(text) => handleAddGoal(text, 'Professional')}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={deleteGoal}
                  onLinkReward={setLinkingGoal}
                  onEditGoal={setEditingGoal}
                  onShareGoal={setSharingGoal}
                  onOpenSuggestions={() => openGoalSuggestions('Professional')}
                  recentlyChanged={recentlyChanged}
                  themeColor={themeColor}
                  isDark={isDark}
                />
              </div>
            </div>
          </>
        )}

        {/* Blessings Tab */}
        {activeTab === 'blessings' && (
          <div className="max-w-2xl mx-auto h-[calc(100vh-200px)]">
            <BlessingsList
              blessings={blessings}
              onAddBlessing={(text, category) => addBlessing({ text, category })}
              onDeleteBlessing={deleteBlessing}
              onOpenSuggestions={openBlessingSuggestions}
              isDark={isDark}
            />
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto h-[calc(100vh-200px)]">
            <RewardsList
              rewards={rewards}
              goals={goals}
              onAddReward={(text, cost) => addReward({ text, cost, earned: false })}
              onUpdateReward={(reward) => updateReward(reward.id, reward)}
              onDeleteReward={deleteReward}
              onOpenSuggestions={openRewardSuggestions}
              isDark={isDark}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t py-2 ${
        isDark
          ? 'bg-slate-900/80 border-slate-700'
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-slate-400">
          <div className={`w-5 h-5 rounded flex items-center justify-center ${themeColor === 'blue' ? 'gradient-bg' : 'gradient-bg-pink'}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <span className={themeColor === 'blue' ? 'gradient-text font-bold' : 'gradient-text-pink font-bold'}>MyResolve</span>
          <span>-</span>
          <span>Achieve your resolutions</span>
        </div>
      </footer>

      {/* Toast */}
      <Toast />

      {/* Edit Goal Modal */}
      {editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
        />
      )}

      {/* Link Reward Modal */}
      <LinkRewardModal
        isOpen={linkingGoal !== null}
        onClose={() => setLinkingGoal(null)}
        goal={linkingGoal}
        rewards={rewards}
        onLinkReward={handleLinkReward}
        themeColor={themeColor}
        isDark={isDark}
      />

      {/* Suggestions Modal */}
      {suggestionsType && (
        <SuggestionsModal
          isOpen={true}
          onClose={() => setSuggestionsType(null)}
          type={suggestionsType}
          category={suggestionsCategory}
          onAddGoal={handleAddGoalSuggestion}
          onAddBlessing={handleAddBlessingSuggestion}
          onAddReward={handleAddRewardSuggestion}
          themeColor={themeColor}
          isDark={isDark}
        />
      )}

      {/* Share Goal Modal */}
      <ShareModal
        isOpen={sharingGoal !== null}
        onClose={() => setSharingGoal(null)}
        goal={sharingGoal}
        ownerName={profile?.display_name || 'User'}
        year={year}
        themeColor={themeColor}
        isDark={isDark}
      />

      {/* Year-End Review Modal */}
      <ReviewModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        goals={goals}
        blessings={blessings}
        rewards={rewards}
        ownerName={profile?.display_name || 'User'}
        year={year}
        themeColor={themeColor}
        isDark={isDark}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        goals={goals}
        blessings={blessings}
        rewards={rewards}
        year={year}
        isDark={isDark}
      />

      {/* AI Chat Coach - Floating Button */}
      <ChatCoach themeColor={themeColor} isDark={isDark} onGoalAdded={refreshGoals} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userEmail={profile?.email || ''}
        isDark={isDark}
        onShowToast={showToast}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearAll}
        onClose={() => setShowClearAll(false)}
        onConfirm={async () => {
          setClearAllLoading(true)
          const yearGoals = goals.filter(g => g.year === year)
          for (const goal of yearGoals) {
            await deleteGoal(goal.id)
          }
          setClearAllLoading(false)
          setShowClearAll(false)
          showToast(`Deleted ${yearGoals.length} goals`)
        }}
        title="Delete All Goals?"
        message={`This will permanently delete all ${goals.filter(g => g.year === year).length} goals for ${year}. This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
        loading={clearAllLoading}
        isDark={isDark}
      />

      {/* AI Onboarding Modal */}
      <AIOnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false)
          // Mark as completed even if skipped
          updateProfile({ onboarding_completed: true })
        }}
        onComplete={handleOnboardingComplete}
        isDark={isDark}
        isBlue={isBlue}
        year={year}
      />
    </div>
  )
}
