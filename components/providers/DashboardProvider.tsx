'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Goal, Blessing, Reward, UserProfile, Quote, GoalStatus, STATUS_DELAY_MS } from '@/lib/types'
import confetti from 'canvas-confetti'

interface DashboardContextType {
  user: User
  profile: UserProfile | null
  goals: Goal[]
  blessings: Blessing[]
  rewards: Reward[]
  quotes: Quote[]
  year: number
  setYear: (year: number) => void
  isBlue: boolean
  toggleTheme: () => void
  isDark: boolean
  toggleDarkMode: () => void
  columnSplit: number
  setColumnSplit: (split: number) => void
  loading: boolean
  recentlyChanged: Map<string, GoalStatus>
  // Goal operations
  addGoal: (goal: Partial<Goal>) => Promise<void>
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  refreshGoals: () => Promise<void>
  // Blessing operations
  addBlessing: (blessing: Partial<Blessing>) => Promise<void>
  deleteBlessing: (id: string) => Promise<void>
  // Reward operations
  addReward: (reward: Partial<Reward>) => Promise<void>
  updateReward: (id: string, updates: Partial<Reward>) => Promise<void>
  deleteReward: (id: string) => Promise<void>
  // Toast
  showToast: (message: string, undoAction?: () => void) => void
  toast: { message: string; undoAction?: () => void } | null
  clearToast: () => void
  // Logout
  logout: () => Promise<void>
  // Profile update
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
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
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [isBlue, setIsBlue] = useState(initialProfile?.is_blue_theme ?? true)
  const [isDark, setIsDark] = useState(initialProfile?.is_dark_mode ?? false)
  const [columnSplit, setColumnSplit] = useState(initialProfile?.column_split ?? 50)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; undoAction?: () => void } | null>(null)
  const [recentlyChanged, setRecentlyChanged] = useState<Map<string, GoalStatus>>(new Map())

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Session expiry detection
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_OUT') {
          window.location.href = '/auth/login?expired=true'
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const [goalsRes, blessingsRes, rewardsRes, quotesRes] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('blessings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('rewards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('quotes').select('*'),
      ])

      // Check for auth errors (session expired)
      const hasAuthError = [goalsRes, blessingsRes, rewardsRes].some(
        res => res.error?.message?.includes('JWT') || res.error?.code === 'PGRST301'
      )
      if (hasAuthError) {
        window.location.href = '/auth/login?expired=true'
        return
      }

      if (goalsRes.data) setGoals(goalsRes.data)
      if (blessingsRes.data) setBlessings(blessingsRes.data)
      if (rewardsRes.data) setRewards(rewardsRes.data)
      if (quotesRes.data) setQuotes(quotesRes.data)

      setLoading(false)
    }

    fetchData()
  }, [user.id, supabase])

  // Refresh all data (used by ChatCoach when AI modifies data)
  const refreshGoals = useCallback(async () => {
    const [goalsRes, blessingsRes, rewardsRes] = await Promise.all([
      supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('blessings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('rewards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    if (goalsRes.data) setGoals(goalsRes.data)
    if (blessingsRes.data) setBlessings(blessingsRes.data)
    if (rewardsRes.data) setRewards(rewardsRes.data)
  }, [supabase, user.id])

  // Update profile preferences
  const updateProfilePrefs = useCallback(async (updates: Partial<UserProfile>) => {
    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
  }, [supabase, user.id])

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : prev)
    await updateProfilePrefs(updates)
  }, [updateProfilePrefs])

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

  // Fire confetti - matching template colors
  const fireConfetti = useCallback((colors: string[] = ['#3b82f6', '#8b5cf6', '#22c55e']) => {
    confetti({
      particleCount: 80,
      spread: 60,
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

  // Goal operations with Done delay logic
  const addGoal = useCallback(async (goalData: Partial<Goal>) => {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        year,
        ...goalData,
      })
      .select()
      .single()

    if (data && !error) {
      setGoals(prev => [data, ...prev])
      fireConfetti(isBlue ? ['#3b82f6', '#60a5fa'] : ['#f43f5e', '#fb7185'])
      showToast('Goal added')
    } else if (error) {
      showToast('Failed to add goal. Please try again.')
    }
  }, [supabase, user.id, year, showToast, isBlue, fireConfetti])

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const oldGoal = goals.find(g => g.id === id)

    // If status changed, track old status for 5 second delay before position changes
    if (updates.status && oldGoal && updates.status !== oldGoal.status) {
      // Store old status in map for sorting delay
      setRecentlyChanged(prev => new Map(prev).set(id, oldGoal.status))

      // Fire confetti if status changed to Done
      if (updates.status === 'Done') {
        fireConfetti(isBlue ? ['#3b82f6', '#10b981'] : ['#f43f5e', '#10b981'])
      }

      // Remove from recentlyChanged after STATUS_DELAY_MS (5 seconds)
      setTimeout(() => {
        setRecentlyChanged(prev => {
          const next = new Map(prev)
          next.delete(id)
          return next
        })
      }, STATUS_DELAY_MS)
    }

    // Optimistic update
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))

    const { error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)

    if (error && oldGoal) {
      // Revert on error
      setGoals(prev => prev.map(g => g.id === id ? oldGoal : g))
      showToast('Failed to update goal. Please try again.')
    }
  }, [supabase, goals, isBlue, fireConfetti, showToast])

  const deleteGoal = useCallback(async (id: string) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return

    // Optimistic delete
    setGoals(prev => prev.filter(g => g.id !== id))

    const { error } = await supabase.from('goals').delete().eq('id', id)

    if (error) {
      setGoals(prev => [goal, ...prev])
      showToast('Failed to delete goal. Please try again.')
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

    if (error) {
      showToast('Failed to add blessing. Please try again.')
      return
    }
    if (data) {
      setBlessings(prev => [data, ...prev])
      fireConfetti(['#f59e0b', '#fbbf24'])
      showToast('Blessing added')
    }
  }, [supabase, user.id, showToast, fireConfetti])

  const deleteBlessing = useCallback(async (id: string) => {
    const blessing = blessings.find(b => b.id === id)
    if (!blessing) return

    setBlessings(prev => prev.filter(b => b.id !== id))

    const { error } = await supabase.from('blessings').delete().eq('id', id)

    if (error) {
      setBlessings(prev => [blessing, ...prev])
      showToast('Failed to delete blessing. Please try again.')
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

    if (error) {
      showToast('Failed to add reward. Please try again.')
      return
    }
    if (data) {
      setRewards(prev => [data, ...prev])
      fireConfetti(['#10b981', '#34d399'])
      showToast('Reward added')
    }
  }, [supabase, user.id, showToast, fireConfetti])

  const updateReward = useCallback(async (id: string, updates: Partial<Reward>) => {
    const oldReward = rewards.find(r => r.id === id)

    setRewards(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))

    // Check if earned changed to true
    if (updates.earned && !oldReward?.earned) {
      fireConfetti(['#10b981', '#34d399', '#fbbf24'])
    }

    const { error } = await supabase.from('rewards').update(updates).eq('id', id)

    if (error && oldReward) {
      setRewards(prev => prev.map(r => r.id === id ? oldReward : r))
      showToast('Failed to update reward. Please try again.')
    }
  }, [supabase, rewards, fireConfetti, showToast])

  const deleteReward = useCallback(async (id: string) => {
    const reward = rewards.find(r => r.id === id)
    if (!reward) return

    setRewards(prev => prev.filter(r => r.id !== id))

    const { error } = await supabase.from('rewards').delete().eq('id', id)

    if (error) {
      setRewards(prev => [reward, ...prev])
      showToast('Failed to delete reward. Please try again.')
    } else {
      showToast('Reward deleted')
    }
  }, [supabase, rewards, showToast])

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
        quotes,
        year,
        setYear,
        isBlue,
        toggleTheme,
        isDark,
        toggleDarkMode,
        columnSplit,
        setColumnSplit: handleSetColumnSplit,
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
        toast,
        clearToast,
        logout,
        updateProfile,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
