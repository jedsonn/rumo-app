'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import {
  Moon, Sun, Palette, BarChart3, Trophy, Trash2,
  ArrowUpDown, Search, LogOut, User, Target, Heart, Gift,
  Image, Calendar, Clock
} from 'lucide-react'
import { FocusModeSelector } from './FocusModeSelector'

export type TabType = 'goals' | 'blessings' | 'rewards' | 'vision' | 'habits' | 'timeline'

interface HeaderProps {
  onShowStats: () => void
  onShowReview: () => void
  onShowImportExport: () => void
  onShowClearAll: () => void
  search: string
  setSearch: (search: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  periodFilter: string
  setPeriodFilter: (filter: string) => void
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function Header({
  onShowStats,
  onShowReview,
  onShowImportExport,
  onShowClearAll,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  periodFilter,
  setPeriodFilter,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const {
    profile,
    year,
    setYear,
    isDark,
    toggleDarkMode,
    isBlue,
    toggleTheme,
    focusMode,
    setFocusMode,
    logout
  } = useDashboard()

  const [showUserMenu, setShowUserMenu] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

  const gradientClass = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const displayName = profile?.display_name || 'My'

  const tabs = [
    { id: 'goals' as const, label: 'Goals', icon: Target },
    { id: 'vision' as const, label: 'Vision', icon: Image },
    { id: 'habits' as const, label: 'Habits', icon: Calendar },
    { id: 'timeline' as const, label: 'Timeline', icon: Clock },
    { id: 'blessings' as const, label: 'Blessings', icon: Heart },
    { id: 'rewards' as const, label: 'Rewards', icon: Gift },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      {/* Row 1: Logo, Tabs, Actions */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-serif font-semibold leading-tight">
                <span className={gradientClass}>{displayName}'s</span>
                <span className="text-slate-800 dark:text-slate-100"> Goals</span>
              </h1>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-transparent cursor-pointer hover:text-blue-500 focus:outline-none"
              >
                {years.map(y => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-800">{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Tabs */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isBlue ? 'text-blue-500' : 'text-rose-500'} hover:bg-slate-100 dark:hover:bg-slate-700`}
              title="Toggle theme color"
            >
              <Palette size={18} />
            </button>
            <button
              onClick={onShowStats}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              title="Stats"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={onShowReview}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-white text-xs ${isBlue ? 'gradient-bg' : 'gradient-bg-pink'} hover:opacity-90`}
            >
              <Trophy size={14} />
              Review
            </button>

            {/* User Menu */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <User size={18} />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                        {profile?.display_name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={onShowImportExport}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <ArrowUpDown size={16} />
                        Import/Export
                      </button>
                      <button
                        onClick={onShowClearAll}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 size={16} />
                        Clear All Data
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Filters (only on Goals tab) */}
      {activeTab === 'goals' && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Focus Mode */}
              <div className="hidden md:block">
                <FocusModeSelector value={focusMode} onChange={setFocusMode} />
              </div>

              {/* Center: Search */}
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search goals..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Right: Filter Pills */}
              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <div className="hidden sm:flex items-center gap-1 p-1 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'done', label: 'Done' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        statusFilter === opt.value
                          ? `${isBlue ? 'bg-blue-500' : 'bg-rose-500'} text-white`
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Period Filter */}
                <div className="hidden md:flex items-center gap-1 p-1 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'One-year', label: '1yr' },
                    { value: 'Three-years', label: '3yr' },
                    { value: 'Five-years', label: '5yr' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPeriodFilter(opt.value)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        periodFilter === opt.value
                          ? `${isBlue ? 'bg-blue-500' : 'bg-rose-500'} text-white`
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
