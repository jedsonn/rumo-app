'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Goal, Blessing, Reward, STATUSES, PERIODS, STATUS_COLORS, PERIOD_COLORS, GoalStatus, GoalPeriod, GoalCategory } from '@/lib/types'
import { TEMPLATE_PACKS, PACK_COLORS, GoalTemplate, TemplatePack } from '@/lib/templates'
import {
  Moon, Sun, Palette, BarChart3, Trophy, Trash2, ArrowUpDown, Search,
  User, Briefcase, Target, Plus, Flame, Pencil, ArrowRight, Check, Gift,
  Heart, X, Sparkles, RefreshCw, BookOpen, ChevronRight, ArrowLeft, HelpCircle, Bell
} from 'lucide-react'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { StreaksBadge, StreaksDisplay } from '@/components/streaks/StreaksDisplay'
import { StreakData, generateSampleStreakData, recordCheckIn, getStreakData, saveStreakData, getTodayDateString } from '@/lib/streaks'
import { NotificationSettings } from '@/components/notifications/NotificationSettings'
import confetti from 'canvas-confetti'

// ============ SAMPLE DATA ============
const SAMPLE_GOALS: Goal[] = [
  { id: '1', user_id: 'demo', number: 1, year: new Date().getFullYear(), goal: "Run a half marathon", period: "One-year", category: "Personal", status: "Doing", action: "Follow 12-week training plan", cost: 150, notes: "Signed up for spring race", pinned: true, linked_reward_id: null, progress: 25, due_date: null, created_at: '', updated_at: '' },
  { id: '2', user_id: 'demo', number: 2, year: new Date().getFullYear(), goal: "Read 24 books this year", period: "One-year", category: "Personal", status: "On Track", action: "Finish current book this week", cost: 0, notes: "12 books done so far", pinned: false, linked_reward_id: null, progress: 50, due_date: null, created_at: '', updated_at: '' },
  { id: '3', user_id: 'demo', number: 3, year: new Date().getFullYear(), goal: "Build emergency fund to $15K", period: "One-year", category: "Personal", status: "Doing", action: "Automate $500/month transfer", cost: 0, notes: "", pinned: false, linked_reward_id: null, progress: 30, due_date: null, created_at: '', updated_at: '' },
  { id: '4', user_id: 'demo', number: 4, year: new Date().getFullYear(), goal: "Learn conversational Spanish", period: "Three-years", category: "Personal", status: "For Later", action: "Research language apps", cost: 200, notes: "Start after marathon", pinned: false, linked_reward_id: null, progress: 0, due_date: null, created_at: '', updated_at: '' },
  { id: '5', user_id: 'demo', number: 5, year: new Date().getFullYear(), goal: "Buy a house", period: "Five-years", category: "Personal", status: "Doing", action: "Research neighborhoods", cost: 50000, notes: "Saving for down payment", pinned: false, linked_reward_id: null, progress: 10, due_date: null, created_at: '', updated_at: '' },
  { id: '6', user_id: 'demo', number: 1, year: new Date().getFullYear(), goal: "Get promoted to Senior level", period: "One-year", category: "Professional", status: "Doing", action: "Schedule career chat with manager", cost: 0, notes: "", pinned: true, linked_reward_id: '201', progress: 40, due_date: null, created_at: '', updated_at: '' },
  { id: '7', user_id: 'demo', number: 2, year: new Date().getFullYear(), goal: "Complete AWS certification", period: "One-year", category: "Professional", status: "On Track", action: "Finish practice exams", cost: 300, notes: "Exam scheduled for next month", pinned: false, linked_reward_id: null, progress: 75, due_date: null, created_at: '', updated_at: '' },
  { id: '8', user_id: 'demo', number: 3, year: new Date().getFullYear(), goal: "Present at industry conference", period: "One-year", category: "Professional", status: "Done", action: "", cost: 500, notes: "Presented at TechConf!", pinned: false, linked_reward_id: null, progress: 100, due_date: null, created_at: '', updated_at: '' },
  { id: '9', user_id: 'demo', number: 4, year: new Date().getFullYear(), goal: "Build side project and launch", period: "One-year", category: "Professional", status: "For Later", action: "Brainstorm project ideas", cost: 100, notes: "", pinned: false, linked_reward_id: null, progress: 0, due_date: null, created_at: '', updated_at: '' },
]

const SAMPLE_BLESSINGS: Blessing[] = [
  { id: '101', user_id: 'demo', text: "Good health and energy to pursue my goals", category: "Personal", created_at: new Date().toISOString() },
  { id: '102', user_id: 'demo', text: "Supportive family who believes in me", category: "Personal", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '103', user_id: 'demo', text: "A job that challenges and fulfills me", category: "Professional", created_at: new Date(Date.now() - 172800000).toISOString() },
]

const SAMPLE_REWARDS: Reward[] = [
  { id: '201', user_id: 'demo', text: "Weekend spa getaway", cost: 300, earned: false, created_at: '', updated_at: '' },
  { id: '202', user_id: 'demo', text: "New running shoes", cost: 150, earned: true, created_at: '', updated_at: '' },
  { id: '203', user_id: 'demo', text: "Nice dinner at favorite restaurant", cost: 100, earned: false, created_at: '', updated_at: '' },
  { id: '204', user_id: 'demo', text: "New book from wishlist", cost: 25, earned: true, created_at: '', updated_at: '' },
]

// ============ TOAST ============
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// ============ MODAL ============
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  )
}

// ============ GOAL CARD ============
function GoalCard({ goal, rewards, isBlue, onUpdate, onDelete }: {
  goal: Goal; rewards: Reward[]; isBlue: boolean;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onDelete: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false)
  const linkedReward = rewards.find(r => r.id === goal.linked_reward_id)

  const cycleStatus = () => {
    const idx = STATUSES.indexOf(goal.status)
    const next = STATUSES[(idx + 1) % STATUSES.length] as GoalStatus
    if (next === 'Done') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#8b5cf6', '#22c55e'] })
    }
    onUpdate(goal.id, { status: next })
  }

  const cyclePeriod = () => {
    const idx = PERIODS.indexOf(goal.period)
    onUpdate(goal.id, { period: PERIODS[(idx + 1) % PERIODS.length] as GoalPeriod })
  }

  const statusColors = STATUS_COLORS[goal.status]
  const periodColors = PERIOD_COLORS[goal.period]
  const cardBg = goal.pinned
    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'

  return (
    <div
      className={`relative rounded-lg border ${cardBg} shadow-sm hover:shadow-md p-3 transition-all`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {goal.pinned && <span className="absolute -top-1 -right-1 text-lg">🔥</span>}

      <div className="flex items-start gap-2">
        <span className="text-xs font-medium text-slate-400">#{goal.number}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-2">{goal.goal}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={cycleStatus} className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border} hover:opacity-80 flex items-center gap-1`}>
            {goal.status === 'Done' && <Check size={12} />}
            {goal.status}
          </button>
          <button onClick={cyclePeriod} className={`px-2 py-0.5 rounded-full text-xs font-medium ${periodColors.bg} ${periodColors.text} hover:opacity-80`}>
            {periodColors.label}
          </button>
        </div>
      </div>

      {goal.action && (
        <div className="mt-2 flex items-center gap-1.5">
          <ArrowRight size={12} className="text-slate-400" />
          <p className="text-xs text-slate-500 truncate">{goal.action}</p>
        </div>
      )}

      {linkedReward && (
        <div className="mt-1 flex items-center gap-1.5">
          <Gift size={12} className="text-purple-500" />
          <p className="text-xs text-purple-600 dark:text-purple-400 truncate">{linkedReward.text}</p>
        </div>
      )}

      {goal.cost > 0 && (
        <div className="mt-1">
          <span className="text-xs text-slate-400">${Number(goal.cost).toLocaleString()}</span>
        </div>
      )}

      <div className={`absolute bottom-1 right-1 flex items-center gap-0.5 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => onUpdate(goal.id, { pinned: !goal.pinned })} className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${goal.pinned ? 'text-amber-500' : 'text-slate-400'}`}>
          <Flame size={14} />
        </button>
        <button onClick={() => onDelete(goal.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ============ MAIN DEMO PAGE ============
export default function DemoPage() {
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS)
  const [blessings, setBlessings] = useState<Blessing[]>(SAMPLE_BLESSINGS)
  const [rewards, setRewards] = useState<Reward[]>(SAMPLE_REWARDS)

  const [year, setYear] = useState(new Date().getFullYear())
  const [isBlue, setIsBlue] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [columnSplit, setColumnSplit] = useState(50)
  const [activeTab, setActiveTab] = useState<'goals' | 'blessings' | 'rewards'>('goals')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [newGoal, setNewGoal] = useState({ personal: '', professional: '' })
  const [newBlessing, setNewBlessing] = useState('')
  const [newReward, setNewReward] = useState({ text: '', cost: '' })
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState<TemplatePack | null>(null)
  const [selectedTemplateGoals, setSelectedTemplateGoals] = useState<Set<number>>(new Set())
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>(generateSampleStreakData())
  const [showStreaks, setShowStreaks] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Check if user has seen onboarding and load streak data
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('rumo_demo_onboarding_complete')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    // Load streak data from localStorage or use sample
    const storedStreak = localStorage.getItem('rumo_streak_data')
    if (storedStreak) {
      try {
        setStreakData(JSON.parse(storedStreak))
      } catch {
        // Use sample data if parsing fails
      }
    } else {
      // For demo, generate sample data and save it
      const sampleData = generateSampleStreakData()
      setStreakData(sampleData)
      saveStreakData(sampleData)
    }
  }, [])

  // Record check-in when user interacts with goals
  const handleCheckIn = () => {
    const today = getTodayDateString()
    if (streakData.lastCheckIn !== today) {
      const newData = recordCheckIn()
      setStreakData(newData)
    }
  }

  const handleOnboardingClose = () => {
    setShowOnboarding(false)
    localStorage.setItem('rumo_demo_onboarding_complete', 'true')
  }

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const filteredGoals = useMemo(() => {
    let result = goals.filter(g => g.year === year)
    if (search) result = result.filter(g => g.goal.toLowerCase().includes(search.toLowerCase()))
    if (statusFilter === 'active') result = result.filter(g => ['Doing', 'On Track'].includes(g.status))
    else if (statusFilter === 'done') result = result.filter(g => g.status === 'Done')
    else if (statusFilter === 'dropped') result = result.filter(g => g.status === 'Dropped')
    if (periodFilter !== 'all') result = result.filter(g => g.period === periodFilter)

    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      const order: Record<string, number> = { 'Doing': 0, 'On Track': 1, 'For Later': 2, 'Done': 3, 'Dropped': 4 }
      return (order[a.status] - order[b.status]) || (a.number - b.number)
    })
    return result
  }, [goals, year, search, statusFilter, periodFilter])

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
    handleCheckIn() // Record engagement
  }

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    setToast('Goal deleted')
  }

  const addGoal = (category: GoalCategory) => {
    const text = category === 'Personal' ? newGoal.personal : newGoal.professional
    if (!text.trim()) return
    const categoryGoals = goals.filter(g => g.category === category)
    const maxNum = Math.max(0, ...categoryGoals.map(g => g.number))
    setGoals(prev => [...prev, {
      id: Date.now().toString(),
      user_id: 'demo',
      number: maxNum + 1,
      year,
      goal: text.trim(),
      period: 'One-year',
      category,
      status: 'Doing',
      action: null,
      cost: 0,
      notes: null,
      pinned: false,
      linked_reward_id: null,
      progress: 0,
      due_date: null,
      created_at: '',
      updated_at: ''
    }])
    setNewGoal(prev => ({ ...prev, [category.toLowerCase()]: '' }))
    setToast('Goal added!')
    handleCheckIn() // Record engagement
  }

  const addBlessing = () => {
    if (!newBlessing.trim()) return
    setBlessings(prev => [{ id: Date.now().toString(), user_id: 'demo', text: newBlessing.trim(), category: 'Personal', created_at: new Date().toISOString() }, ...prev])
    setNewBlessing('')
    setToast('Blessing added!')
  }

  const addReward = () => {
    if (!newReward.text.trim()) return
    setRewards(prev => [...prev, { id: Date.now().toString(), user_id: 'demo', text: newReward.text.trim(), cost: parseFloat(newReward.cost) || 0, earned: false, created_at: '', updated_at: '' }])
    setNewReward({ text: '', cost: '' })
    setToast('Reward added!')
  }

  const toggleRewardEarned = (id: string) => {
    const reward = rewards.find(r => r.id === id)
    if (reward && !reward.earned) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#8b5cf6', '#fbbf24'] })
    }
    setRewards(prev => prev.map(r => r.id === id ? { ...r, earned: !r.earned } : r))
  }

  // Template handlers
  const handleSelectPack = (pack: TemplatePack) => {
    setSelectedPack(pack)
    setSelectedTemplateGoals(new Set(pack.goals.map((_, i) => i)))
  }

  const handleBackToTemplates = () => {
    setSelectedPack(null)
    setSelectedTemplateGoals(new Set())
  }

  const toggleTemplateGoal = (index: number) => {
    const newSelected = new Set(selectedTemplateGoals)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedTemplateGoals(newSelected)
  }

  const addTemplateGoals = () => {
    if (!selectedPack) return
    const goalsToAdd = selectedPack.goals.filter((_, i) => selectedTemplateGoals.has(i))

    goalsToAdd.forEach((template, idx) => {
      const categoryGoals = goals.filter(g => g.category === template.category)
      const maxNum = Math.max(0, ...categoryGoals.map(g => g.number))

      setGoals(prev => [...prev, {
        id: `${Date.now()}-${idx}`,
        user_id: 'demo',
        number: maxNum + 1 + idx,
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
        progress: 0,
        due_date: null,
        created_at: '',
        updated_at: ''
      }])
    })

    setToast(`Added ${goalsToAdd.length} goals from ${selectedPack.name}!`)
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#3b82f6', '#8b5cf6', '#22c55e'] })
    setTemplatesOpen(false)
    setSelectedPack(null)
    setSelectedTemplateGoals(new Set())
  }

  // Resizer
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setColumnSplit(Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100)))
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      const handleUp = () => setIsResizing(false)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleUp)
      return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleUp) }
    }
  }, [isResizing, handleMouseMove])

  const gradientClass = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const gradientBg = isBlue ? 'gradient-bg' : 'gradient-bg-pink'
  const years = [year - 1, year, year + 1, year + 2]

  const renderGoalsColumn = (category: GoalCategory) => {
    const catGoals = filteredGoals.filter(g => g.category === category)
    const Icon = category === 'Personal' ? User : Briefcase
    const inputKey = category.toLowerCase() as 'personal' | 'professional'

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Icon size={20} className="text-slate-500" />
            <h2 className={`font-serif font-semibold text-lg ${gradientClass}`}>{category}</h2>
            <span className="text-xs text-slate-400">{catGoals.length} goals</span>
          </div>
          <button
            onClick={() => setTemplatesOpen(true)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Templates</span>
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); addGoal(category) }} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newGoal[inputKey]}
            onChange={(e) => setNewGoal(prev => ({ ...prev, [inputKey]: e.target.value }))}
            placeholder={`Add ${category.toLowerCase()} goal...`}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
          />
          <button type="submit" className={`p-2 rounded-lg text-white ${gradientBg}`}><Plus size={20} /></button>
        </form>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {catGoals.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Target size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No goals yet</p>
            </div>
          ) : (
            catGoals.map(goal => <GoalCard key={goal.id} goal={goal} rewards={rewards} isBlue={isBlue} onUpdate={updateGoal} onDelete={deleteGoal} />)
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-serif text-lg font-semibold ${gradientClass}`}>Demo User's</span>
                  <span className="font-serif text-lg font-semibold text-slate-800 dark:text-slate-100">Goals</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Demo Mode</span>
                </div>
                <p className="text-xs text-slate-400">Set your direction</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StreaksBadge streakData={streakData} onClick={() => setShowStreaks(true)} />
              <button onClick={() => setShowNotifications(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500" title="Notification Settings">
                <Bell size={18} />
              </button>
              <button onClick={() => setShowOnboarding(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500" title="How to use Rumo">
                <HelpCircle size={18} />
              </button>
              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsBlue(!isBlue)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                <Palette size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="done">Done</option>
              <option value="dropped">Dropped</option>
            </select>
            <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="hidden sm:block px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              <option value="all">All Periods</option>
              <option value="One-year">1-Year</option>
              <option value="Three-years">3-Year</option>
              <option value="Five-years">5-Year</option>
            </select>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          {[
            { id: 'goals' as const, label: 'Goals', icon: Target },
            { id: 'blessings' as const, label: 'Blessings', icon: Heart },
            { id: 'rewards' as const, label: 'Rewards', icon: Gift },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 pb-20">
        {activeTab === 'goals' && (
          <div ref={containerRef} className="flex gap-0 h-[calc(100vh-240px)]">
            <div style={{ width: `${columnSplit}%` }} className="pr-2 overflow-hidden">{renderGoalsColumn('Personal')}</div>
            <div onMouseDown={() => setIsResizing(true)} onDoubleClick={() => setColumnSplit(50)} className={`w-1 bg-slate-200 dark:bg-slate-700 hover:bg-gradient-to-b hover:from-blue-500 hover:to-violet-500 rounded-full cursor-col-resize shrink-0 ${isResizing ? 'gradient-bg' : ''}`} />
            <div style={{ width: `${100 - columnSplit}%` }} className="pl-2 overflow-hidden">{renderGoalsColumn('Professional')}</div>
          </div>
        )}

        {activeTab === 'blessings' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-1">🙏 Count Your Blessings</h2>
              <p className="text-sm text-amber-600/70">Gratitude turns what we have into enough</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addBlessing() }} className="flex gap-2 mb-4">
              <input type="text" value={newBlessing} onChange={(e) => setNewBlessing(e.target.value)} placeholder="What are you grateful for today?" className="flex-1 px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800" />
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white"><Plus size={20} /></button>
            </form>
            <div className="space-y-2">
              {blessings.map(b => (
                <div key={b.id} className="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50">
                  <div>
                    <p className="text-slate-700 dark:text-slate-200">{b.text}</p>
                    <p className="text-xs text-amber-500 mt-0.5">{new Date(b.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setBlessings(prev => prev.filter(x => x.id !== b.id))} className="opacity-0 group-hover:opacity-100 p-1 text-amber-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-1">🎁 Rewards</h2>
              <p className="text-sm text-purple-600/70">Celebrate your wins</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-2xl font-semibold text-purple-700 dark:text-purple-400">{rewards.length}</p>
                <p className="text-xs text-purple-600/70">Total</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-2xl font-semibold text-green-700 dark:text-green-400">{rewards.filter(r => r.earned).length}</p>
                <p className="text-xs text-green-600/70">Earned</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">${rewards.filter(r => r.earned).reduce((s, r) => s + Number(r.cost), 0)}</p>
                <p className="text-xs text-amber-600/70">Value</p>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addReward() }} className="flex gap-2 mb-4">
              <input type="text" value={newReward.text} onChange={(e) => setNewReward(prev => ({ ...prev, text: e.target.value }))} placeholder="Add a reward..." className="flex-1 px-4 py-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800" />
              <input type="number" value={newReward.cost} onChange={(e) => setNewReward(prev => ({ ...prev, cost: e.target.value }))} placeholder="$" className="w-20 px-3 py-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800" />
              <button type="submit" className={`px-4 py-2.5 rounded-lg text-white ${gradientBg}`}><Plus size={20} /></button>
            </form>
            <div className="space-y-2">
              {rewards.map(r => (
                <div key={r.id} className={`group flex items-center gap-3 p-3 rounded-lg border ${r.earned ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-white dark:bg-slate-800 border-purple-100'}`}>
                  <button onClick={() => toggleRewardEarned(r.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${r.earned ? 'bg-green-500 border-green-500 text-white' : 'border-purple-300'}`}>
                    {r.earned && <Check size={12} />}
                  </button>
                  <p className={`flex-1 ${r.earned ? 'line-through text-slate-500' : ''}`}>{r.text}</p>
                  {Number(r.cost) > 0 && <span className="text-sm text-purple-500">${r.cost}</span>}
                  <button onClick={() => setRewards(prev => prev.filter(x => x.id !== r.id))} className="opacity-0 group-hover:opacity-100 p-1 text-purple-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
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
          <span className={gradientClass}>Rumo</span>
          <span>—</span>
          <span>Demo Mode</span>
        </div>
      </footer>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Templates Modal */}
      <Modal isOpen={templatesOpen} onClose={() => { setTemplatesOpen(false); setSelectedPack(null); setSelectedTemplateGoals(new Set()) }} title={selectedPack ? selectedPack.name : 'Goal Templates'}>
        {!selectedPack ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Choose a template pack to quickly add pre-built goals
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATE_PACKS.map((pack) => {
                const colors = PACK_COLORS[pack.color]
                return (
                  <button
                    key={pack.id}
                    onClick={() => handleSelectPack(pack)}
                    className={`text-left p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all group`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{pack.emoji}</span>
                          <h3 className={`font-semibold ${colors.text}`}>{pack.name}</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {pack.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {pack.goals.length} goals
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleBackToTemplates}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4"
            >
              <ArrowLeft size={16} />
              Back to templates
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{selectedPack.emoji}</span>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{selectedPack.name}</h3>
                <p className="text-sm text-slate-500">{selectedPack.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {selectedPack.goals.map((goal, index) => {
                const isSelected = selectedTemplateGoals.has(index)
                return (
                  <button
                    key={index}
                    onClick={() => toggleTemplateGoal(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-100">{goal.goal}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          → {goal.action}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {goal.period === 'One-year' ? '1yr' : goal.period === 'Three-years' ? '3yr' : '5yr'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {goal.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500">
                {selectedTemplateGoals.size} of {selectedPack.goals.length} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleBackToTemplates}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={addTemplateGoals}
                  disabled={selectedTemplateGoals.size === 0}
                  className={`px-4 py-2 rounded-lg text-white ${gradientBg} hover:opacity-90 disabled:opacity-50 flex items-center gap-2`}
                >
                  <Plus size={18} />
                  Add {selectedTemplateGoals.size} Goals
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        onOpenTemplates={() => { handleOnboardingClose(); setTemplatesOpen(true) }}
        isBlue={isBlue}
      />

      {/* Streaks Modal */}
      <Modal isOpen={showStreaks} onClose={() => setShowStreaks(false)} title="Your Progress">
        <StreaksDisplay streakData={streakData} isBlue={isBlue} />
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update or add goals daily to build your streak!
          </p>
        </div>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notification Settings">
        <NotificationSettings isBlue={isBlue} onSave={() => setToast('Notification preferences saved!')} />
      </Modal>
    </div>
  )
}
