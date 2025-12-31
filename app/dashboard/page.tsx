'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Header } from '@/components/ui/Header'
import { GoalsColumn } from '@/components/goals/GoalsColumn'
import { TemplatesModal } from '@/components/goals/TemplatesModal'
import { Toast } from '@/components/ui/Toast'
import { GoalTemplate } from '@/lib/templates'
import { Target, Heart, Gift } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const {
    goals,
    year,
    isBlue,
    columnSplit,
    setColumnSplit,
    loading,
    addGoal,
    showToast,
  } = useDashboard()

  const [activeTab, setActiveTab] = useState<'goals' | 'blessings' | 'rewards'>('goals')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Modal states
  const [showStats, setShowStats] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [showClearAll, setShowClearAll] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

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

    // Sort: pinned first, then by status priority, then by number
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      const statusOrder: Record<string, number> = { 'Doing': 0, 'On Track': 1, 'For Later': 2, 'Done': 3, 'Dropped': 4 }
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff

      return a.number - b.number
    })

    return result
  }, [goals, year, search, statusFilter, periodFilter])

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
      />

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          {[
            { id: 'goals' as const, label: 'Goals', icon: Target },
            { id: 'blessings' as const, label: 'Blessings', icon: Heart },
            { id: 'rewards' as const, label: 'Rewards', icon: Gift },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 pb-16">
        {activeTab === 'goals' && (
          <>
            {/* Desktop: Two columns with resizer */}
            <div
              ref={containerRef}
              className="hidden md:flex gap-0 h-[calc(100vh-220px)] relative"
            >
              {/* Personal Column */}
              <div style={{ width: `${columnSplit}%` }} className="pr-2 overflow-hidden">
                <GoalsColumn category="Personal" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} />
              </div>

              {/* Resizer */}
              <div
                onMouseDown={handleMouseDown}
                onDoubleClick={() => setColumnSplit(50)}
                className={`resizer w-1 bg-slate-200 dark:bg-slate-700 hover:gradient-bg rounded-full cursor-col-resize flex-shrink-0 relative ${isResizing ? 'gradient-bg' : ''}`}
              >
                {isResizing && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {Math.round(columnSplit)}:{Math.round(100 - columnSplit)}
                  </div>
                )}
              </div>

              {/* Professional Column */}
              <div style={{ width: `${100 - columnSplit}%` }} className="pl-2 overflow-hidden">
                <GoalsColumn category="Professional" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} />
              </div>
            </div>

            {/* Mobile: Stacked columns */}
            <div className="md:hidden space-y-6">
              <div className="min-h-[40vh]">
                <GoalsColumn category="Personal" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} />
              </div>
              <div className="min-h-[40vh]">
                <GoalsColumn category="Professional" filteredGoals={filteredGoals} onOpenTemplates={() => setShowTemplates(true)} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'blessings' && (
          <div className="py-4">
            <Link href="/dashboard/blessings" className="text-blue-500 hover:underline">
              Go to Blessings page →
            </Link>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="py-4">
            <Link href="/dashboard/rewards" className="text-blue-500 hover:underline">
              Go to Rewards page →
            </Link>
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
          <span className={isBlue ? 'gradient-text' : 'gradient-text-pink'}>Rumo</span>
          <span>—</span>
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
    </div>
  )
}
