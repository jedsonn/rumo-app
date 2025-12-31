'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import {
  Goal, Blessing, Reward, UserProfile, VisionBoardItem, Habit,
  HabitCompletion, GoalMilestone, GoalProgressNote, Quote, FocusMode
} from '@/lib/types'
import confetti from 'canvas-confetti'

interface DashboardContextType {
  user: User
  profile: UserProfile | null
  goals: Goal[]
  blessings: Blessing[]
  rewards: Reward[]
  visionBoardItems: VisionBoardItem[]
  habits: Habit[]
  habitCompletions: HabitCompletion[]
  milestones: GoalMilestone[]
  progressNotes: GoalProgressNote[]
  quotes: Quote[]
  year: number
  setYear: (year: number) => void
  isBlue: boolean
  toggleTheme: () => void
  isDark: boolean
  toggleDarkMode: () => void
  columnSplit: number
  setColumnSplit: (split: number) => void
  focusMode: FocusMode
  setFocusMode: (mode: FocusMode) => void
  loading: boolean
  // Goal operations
  addGoal: (goal: Partial<Goal>) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  // Blessing operations
  addBlessing: (blessing: Partial<Blessing>) => Promise<void>
  deleteBlessing: (id: string) => Promise<void>
  // Reward operations
  addReward: (reward: Partial<Reward>) => Promise<void>
  updateReward: (id: string, updates: Partial<Reward>) => Promise<void>
  deleteReward: (id: string) => Promise<void>
  // Vision Board operations
  addVisionBoardItem: (item: Partial<VisionBoardItem>) => Promise<void>
  updateVisionBoardItem: (id: string, updates: Partial<VisionBoardItem>) => Promise<void>
  deleteVisionBoardItem: (id: string) => Promise<void>
  // Habit operations
  addHabit: (habit: Partial<Habit>) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabitCompletion: (habitId: string, date: string) => Promise<void>
  // Milestone operations
  addMilestone: (goalId: string, title: string) => Promise<void>
  updateMilestone: (id: string, updates: Partial<GoalMilestone>) => Promise<void>
  deleteMilestone: (id: string) => Promise<void>
  // Progress Note operations
  addProgressNote: (goalId: string, content: string, progressPercent?: number) => Promise<void>
  deleteProgressNote: (id: string) => Promise<void>
  // Toast
  showToast: (message: string, undoAction?: () => void) => void
  toast: { message: string; undoAction?: () => void } | null
  clearToast: () => void
  // Logout
  logout: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

interface DashboardProviderProps {
  children: ReactNode
  user: User
  initialProfile: UserProfile | null
}

export function DashboardProvider({ children, user, initialProfile }: DashboardProviderProps) {
  const supabase = createClient()

  const [profile, setProfile] = useState<UserProfile | null>(initialProfile)
  const [goals, setGoals] = useState<Goal[]>([])
  const [blessings, setBlessings] = useState<Blessing[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [milestones, setMilestones] = useState<GoalMilestone[]>([])
  const [progressNotes, setProgressNotes] = useState<GoalProgressNote[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [isBlue, setIsBlue] = useState(initialProfile?.is_blue_theme ?? true)
  const [isDark, setIsDark] = useState(initialProfile?.is_dark_mode ?? false)
  const [columnSplit, setColumnSplit] = useState(initialProfile?.column_split ?? 50)
  const [focusMode, setFocusModeState] = useState<FocusMode>(initialProfile?.focus_mode ?? 'all')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; undoAction?: () => void } | null>(null)

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const [
        goalsRes,
        blessingsRes,
        rewardsRes,
        visionRes,
        habitsRes,
        completionsRes,
        milestonesRes,
        notesRes,
        quotesRes
      ] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('blessings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('rewards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('vision_board_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('habit_completions').select('*').eq('user_id', user.id),
        supabase.from('goal_milestones').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
        supabase.from('goal_progress_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('quotes').select('*'),
      ])

      if (goalsRes.data) setGoals(goalsRes.data)
      if (blessingsRes.data) setBlessings(blessingsRes.data)
      if (rewardsRes.data) setRewards(rewardsRes.data)
      if (visionRes.data) setVisionBoardItems(visionRes.data)
      if (habitsRes.data) setHabits(habitsRes.data)
      if (completionsRes.data) setHabitCompletions(completionsRes.data)
      if (milestonesRes.data) setMilestones(milestonesRes.data)
      if (notesRes.data) setProgressNotes(notesRes.data)
      if (quotesRes.data) setQuotes(quotesRes.data)

      setLoading(false)
    }

    fetchData()
  }, [user.id, supabase])

  // Update profile preferences
  const updateProfilePrefs = useCallback(async (updates: Partial<UserProfile>) => {
    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
  }, [supabase, user.id])

  const toggleTheme = useCallback(() => {
    setIsBlue(prev => {
      const newValue = !prev
      updateProfilePrefs({ is_blue_theme: newValue })
      return newValue
    })
  }, [updateProfilePrefs])

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev
      updateProfilePrefs({ is_dark_mode: newValue })
      return newValue
    })
  }, [updateProfilePrefs])

  const handleSetColumnSplit = useCallback((split: number) => {
    setColumnSplit(split)
    updateProfilePrefs({ column_split: split })
  }, [updateProfilePrefs])

  const setFocusMode = useCallback((mode: FocusMode) => {
    setFocusModeState(mode)
    updateProfilePrefs({ focus_mode: mode })
  }, [updateProfilePrefs])

  // Fire confetti
  const fireConfetti = useCallback((colors: string[] = ['#3b82f6', '#8b5cf6', '#22c55e']) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    })
  }, [])

  // Toast
  const showToast = useCallback((message: string, undoAction?: () => void) => {
    setToast({ message, undoAction })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  // Goal operations
  const addGoal = useCallback(async (goalData: Partial<Goal>) => {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        year,
        progress: 0,
        ...goalData,
      })
      .select()
      .single()

    if (data && !error) {
      setGoals(prev => [data, ...prev])
      showToast('Goal added')
    }
  }, [supabase, user.id, year, showToast])

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const oldGoal = goals.find(g => g.id === id)

    // Optimistic update
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))

    // Check if status changed to Done
    if (updates.status === 'Done' && oldGoal?.status !== 'Done') {
      fireConfetti(isBlue ? ['#3b82f6', '#8b5cf6', '#22c55e'] : ['#ec4899', '#f43f5e', '#22c55e'])
    }

    const { error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)

    if (error) {
      // Revert on error
      if (oldGoal) {
        setGoals(prev => prev.map(g => g.id === id ? oldGoal : g))
      }
    }
  }, [supabase, goals, isBlue, fireConfetti])

  const deleteGoal = useCallback(async (id: string) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return

    // Optimistic delete
    setGoals(prev => prev.filter(g => g.id !== id))

    const { error } = await supabase.from('goals').delete().eq('id', id)

    if (error) {
      setGoals(prev => [goal, ...prev])
    } else {
      showToast('Goal deleted', () => {
        // Undo: re-insert
        supabase.from('goals').insert(goal).then(({ data }) => {
          if (data) setGoals(prev => [data, ...prev])
        })
      })
    }
  }, [supabase, goals, showToast])

  // Blessing operations
  const addBlessing = useCallback(async (blessingData: Partial<Blessing>) => {
    const { data, error } = await supabase
      .from('blessings')
      .insert({
        user_id: user.id,
        ...blessingData,
      })
      .select()
      .single()

    if (data && !error) {
      setBlessings(prev => [data, ...prev])
      showToast('Blessing added')
    }
  }, [supabase, user.id, showToast])

  const deleteBlessing = useCallback(async (id: string) => {
    const blessing = blessings.find(b => b.id === id)
    if (!blessing) return

    setBlessings(prev => prev.filter(b => b.id !== id))

    const { error } = await supabase.from('blessings').delete().eq('id', id)

    if (error) {
      setBlessings(prev => [blessing, ...prev])
    } else {
      showToast('Blessing deleted')
    }
  }, [supabase, blessings, showToast])

  // Reward operations
  const addReward = useCallback(async (rewardData: Partial<Reward>) => {
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        user_id: user.id,
        ...rewardData,
      })
      .select()
      .single()

    if (data && !error) {
      setRewards(prev => [data, ...prev])
      showToast('Reward added')
    }
  }, [supabase, user.id, showToast])

  const updateReward = useCallback(async (id: string, updates: Partial<Reward>) => {
    const oldReward = rewards.find(r => r.id === id)

    setRewards(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))

    // Check if earned changed to true
    if (updates.earned && !oldReward?.earned) {
      fireConfetti(isBlue ? ['#3b82f6', '#8b5cf6', '#fbbf24'] : ['#ec4899', '#f43f5e', '#fbbf24'])
    }

    const { error } = await supabase.from('rewards').update(updates).eq('id', id)

    if (error && oldReward) {
      setRewards(prev => prev.map(r => r.id === id ? oldReward : r))
    }
  }, [supabase, rewards, isBlue, fireConfetti])

  const deleteReward = useCallback(async (id: string) => {
    const reward = rewards.find(r => r.id === id)
    if (!reward) return

    setRewards(prev => prev.filter(r => r.id !== id))

    const { error } = await supabase.from('rewards').delete().eq('id', id)

    if (error) {
      setRewards(prev => [reward, ...prev])
    } else {
      showToast('Reward deleted')
    }
  }, [supabase, rewards, showToast])

  // Vision Board operations
  const addVisionBoardItem = useCallback(async (itemData: Partial<VisionBoardItem>) => {
    const { data, error } = await supabase
      .from('vision_board_items')
      .insert({
        user_id: user.id,
        ...itemData,
      })
      .select()
      .single()

    if (data && !error) {
      setVisionBoardItems(prev => [data, ...prev])
      showToast('Vision board item added')
    }
  }, [supabase, user.id, showToast])

  const updateVisionBoardItem = useCallback(async (id: string, updates: Partial<VisionBoardItem>) => {
    const oldItem = visionBoardItems.find(i => i.id === id)

    setVisionBoardItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))

    const { error } = await supabase.from('vision_board_items').update(updates).eq('id', id)

    if (error && oldItem) {
      setVisionBoardItems(prev => prev.map(i => i.id === id ? oldItem : i))
    }
  }, [supabase, visionBoardItems])

  const deleteVisionBoardItem = useCallback(async (id: string) => {
    const item = visionBoardItems.find(i => i.id === id)
    if (!item) return

    setVisionBoardItems(prev => prev.filter(i => i.id !== id))

    const { error } = await supabase.from('vision_board_items').delete().eq('id', id)

    if (error) {
      setVisionBoardItems(prev => [item, ...prev])
    } else {
      showToast('Vision board item deleted')
    }
  }, [supabase, visionBoardItems, showToast])

  // Habit operations
  const addHabit = useCallback(async (habitData: Partial<Habit>) => {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        ...habitData,
      })
      .select()
      .single()

    if (data && !error) {
      setHabits(prev => [data, ...prev])
      showToast('Habit created')
    }
  }, [supabase, user.id, showToast])

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const oldHabit = habits.find(h => h.id === id)

    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h))

    const { error } = await supabase.from('habits').update(updates).eq('id', id)

    if (error && oldHabit) {
      setHabits(prev => prev.map(h => h.id === id ? oldHabit : h))
    }
  }, [supabase, habits])

  const deleteHabit = useCallback(async (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return

    setHabits(prev => prev.filter(h => h.id !== id))
    // Also remove related completions
    setHabitCompletions(prev => prev.filter(c => c.habit_id !== id))

    const { error } = await supabase.from('habits').delete().eq('id', id)

    if (error) {
      setHabits(prev => [habit, ...prev])
    } else {
      showToast('Habit deleted')
    }
  }, [supabase, habits, showToast])

  const toggleHabitCompletion = useCallback(async (habitId: string, date: string) => {
    const existing = habitCompletions.find(c => c.habit_id === habitId && c.completed_date === date)

    if (existing) {
      // Remove completion
      setHabitCompletions(prev => prev.filter(c => c.id !== existing.id))
      await supabase.from('habit_completions').delete().eq('id', existing.id)
    } else {
      // Add completion
      const { data, error } = await supabase
        .from('habit_completions')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          completed_date: date,
        })
        .select()
        .single()

      if (data && !error) {
        setHabitCompletions(prev => [...prev, data])
        // Check if this is today and fire confetti
        const today = new Date().toISOString().split('T')[0]
        if (date === today) {
          fireConfetti(isBlue ? ['#3b82f6', '#22c55e'] : ['#ec4899', '#22c55e'])
        }
      }
    }
  }, [supabase, habitCompletions, user.id, isBlue, fireConfetti])

  // Milestone operations
  const addMilestone = useCallback(async (goalId: string, title: string) => {
    const goalMilestones = milestones.filter(m => m.goal_id === goalId)
    const maxOrder = goalMilestones.length > 0
      ? Math.max(...goalMilestones.map(m => m.sort_order))
      : 0

    const { data, error } = await supabase
      .from('goal_milestones')
      .insert({
        user_id: user.id,
        goal_id: goalId,
        title,
        sort_order: maxOrder + 1,
      })
      .select()
      .single()

    if (data && !error) {
      setMilestones(prev => [...prev, data])
    }
  }, [supabase, user.id, milestones])

  const updateMilestone = useCallback(async (id: string, updates: Partial<GoalMilestone>) => {
    const oldMilestone = milestones.find(m => m.id === id)

    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))

    // If completing a milestone, check if all milestones for that goal are done
    if (updates.completed && oldMilestone) {
      const goalMilestones = milestones.filter(m => m.goal_id === oldMilestone.goal_id)
      const allComplete = goalMilestones.every(m =>
        m.id === id ? updates.completed : m.completed
      )
      if (allComplete && goalMilestones.length > 0) {
        fireConfetti(isBlue ? ['#3b82f6', '#22c55e', '#fbbf24'] : ['#ec4899', '#22c55e', '#fbbf24'])
      }
    }

    const { error } = await supabase.from('goal_milestones').update(updates).eq('id', id)

    if (error && oldMilestone) {
      setMilestones(prev => prev.map(m => m.id === id ? oldMilestone : m))
    }
  }, [supabase, milestones, isBlue, fireConfetti])

  const deleteMilestone = useCallback(async (id: string) => {
    const milestone = milestones.find(m => m.id === id)
    if (!milestone) return

    setMilestones(prev => prev.filter(m => m.id !== id))

    const { error } = await supabase.from('goal_milestones').delete().eq('id', id)

    if (error) {
      setMilestones(prev => [...prev, milestone])
    }
  }, [supabase, milestones])

  // Progress Note operations
  const addProgressNote = useCallback(async (goalId: string, content: string, progressPercent?: number) => {
    const { data, error } = await supabase
      .from('goal_progress_notes')
      .insert({
        user_id: user.id,
        goal_id: goalId,
        content,
        progress_percent: progressPercent ?? null,
      })
      .select()
      .single()

    if (data && !error) {
      setProgressNotes(prev => [data, ...prev])

      // Also update goal progress if provided
      if (progressPercent !== undefined) {
        updateGoal(goalId, { progress: progressPercent })
      }

      showToast('Progress note added')
    }
  }, [supabase, user.id, updateGoal, showToast])

  const deleteProgressNote = useCallback(async (id: string) => {
    const note = progressNotes.find(n => n.id === id)
    if (!note) return

    setProgressNotes(prev => prev.filter(n => n.id !== id))

    const { error } = await supabase.from('goal_progress_notes').delete().eq('id', id)

    if (error) {
      setProgressNotes(prev => [note, ...prev])
    }
  }, [supabase, progressNotes])

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }, [supabase])

  return (
    <DashboardContext.Provider
      value={{
        user,
        profile,
        goals,
        blessings,
        rewards,
        visionBoardItems,
        habits,
        habitCompletions,
        milestones,
        progressNotes,
        quotes,
        year,
        setYear,
        isBlue,
        toggleTheme,
        isDark,
        toggleDarkMode,
        columnSplit,
        setColumnSplit: handleSetColumnSplit,
        focusMode,
        setFocusMode,
        loading,
        addGoal,
        updateGoal,
        deleteGoal,
        addBlessing,
        deleteBlessing,
        addReward,
        updateReward,
        deleteReward,
        addVisionBoardItem,
        updateVisionBoardItem,
        deleteVisionBoardItem,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addProgressNote,
        deleteProgressNote,
        showToast,
        toast,
        clearToast,
        logout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
