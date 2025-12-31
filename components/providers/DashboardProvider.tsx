'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Goal, Blessing, Reward, UserProfile } from '@/lib/types'
import confetti from 'canvas-confetti'

interface DashboardContextType {
  user: User
  profile: UserProfile | null
  goals: Goal[]
  blessings: Blessing[]
  rewards: Reward[]
  year: number
  setYear: (year: number) => void
  isBlue: boolean
  toggleTheme: () => void
  isDark: boolean
  toggleDarkMode: () => void
  columnSplit: number
  setColumnSplit: (split: number) => void
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
  const [year, setYear] = useState(new Date().getFullYear())
  const [isBlue, setIsBlue] = useState(initialProfile?.is_blue_theme ?? true)
  const [isDark, setIsDark] = useState(initialProfile?.is_dark_mode ?? false)
  const [columnSplit, setColumnSplit] = useState(initialProfile?.column_split ?? 50)
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

      const [goalsRes, blessingsRes, rewardsRes] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('blessings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('rewards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      if (goalsRes.data) setGoals(goalsRes.data)
      if (blessingsRes.data) setBlessings(blessingsRes.data)
      if (rewardsRes.data) setRewards(rewardsRes.data)

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
        year,
        setYear,
        isBlue,
        toggleTheme,
        isDark,
        toggleDarkMode,
        columnSplit,
        setColumnSplit: handleSetColumnSplit,
        loading,
        addGoal,
        updateGoal,
        deleteGoal,
        addBlessing,
        deleteBlessing,
        addReward,
        updateReward,
        deleteReward,
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
