'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import {
  Moon, Sun, Palette, BarChart3, Trophy, Trash2,
  ArrowUpDown, Search, LogOut, User, Target, Heart, Gift
} from 'lucide-react'

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
  activeTab: 'goals' | 'blessings' | 'rewards'
  setActiveTab: (tab: 'goals' | 'blessings' | 'rewards') => void
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
    logout
  } = useDashboard()

  const [showUserMenu, setShowUserMenu] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

  const gradientClass = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const displayName = profile?.display_name || 'My'

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main Row */}
        <div className="flex items-center justify-between">
          {/* Left Side - Action Buttons */}
          <div className="flex items-center gap-0.5 md:gap-1">
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 md:p-2 rounded-lg ${isDark ? 'bg-slate-700 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1.5 md:p-2 rounded-lg ${isBlue ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-500' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-500'}`}
              title="Toggle theme color"
            >
              <Palette size={18} />
            </button>
            <button
              onClick={onShowImportExport}
              className="hidden sm:block p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              title="Import/Export"
            >
              <ArrowUpDown size={18} />
            </button>
            <button
              onClick={onShowStats}
              className="p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              title="Stats"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={onShowClearAll}
              className="hidden sm:block p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-500"
              title="Clear All"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Center - Logo, Title, and Tabs */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
              <h1 className="text-lg font-serif font-semibold">
                <span className={gradientClass}>{displayName}'s</span>
                <span className="text-slate-800 dark:text-slate-100"> Goals </span>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="font-serif font-semibold bg-transparent text-slate-800 dark:text-slate-100 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
                >
                  {years.map(y => (
                    <option key={y} value={y} className="bg-white dark:bg-slate-800">{y}</option>
                  ))}
                </select>
              </h1>
            </div>
            {/* Tabs */}
            <div className="flex gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
              <button
                onClick={() => setActiveTab('goals')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'goals'
                    ? 'bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Target size={12} />
                Goals
              </button>
              <button
                onClick={() => setActiveTab('blessings')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'blessings'
                    ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Heart size={12} />
                Blessings
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'rewards'
                    ? 'bg-white dark:bg-slate-700 shadow text-purple-600 dark:text-purple-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Gift size={12} />
                Rewards
              </button>
            </div>
          </div>

          {/* Right Side - Filters and User */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-28 lg:w-36 pl-8 pr-2 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="hidden sm:flex gap-0 p-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">
              {[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active', activeClass: 'text-blue-600 dark:text-blue-400' },
                { value: 'done', label: 'Done', activeClass: 'text-emerald-600 dark:text-emerald-400' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                    statusFilter === opt.value
                      ? `bg-white dark:bg-slate-600 shadow ${opt.activeClass || 'text-slate-700 dark:text-slate-200'}`
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Period Filter Pills */}
            <div className="hidden md:flex gap-0 p-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">
              {[
                { value: 'all', label: 'All' },
                { value: 'One-year', label: '1yr', activeClass: 'text-sky-600 dark:text-sky-400' },
                { value: 'Three-years', label: '3yr', activeClass: 'text-amber-600 dark:text-amber-400' },
                { value: 'Five-years', label: '5yr', activeClass: 'text-violet-600 dark:text-violet-400' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPeriodFilter(opt.value)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                    periodFilter === opt.value
                      ? `bg-white dark:bg-slate-600 shadow ${opt.activeClass || 'text-slate-700 dark:text-slate-200'}`
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Review Button */}
            <button
              onClick={onShowReview}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-white text-xs ${isBlue ? 'gradient-bg' : 'gradient-bg-pink'}`}
            >
              <Trophy size={14} />
              Review
            </button>

            {/* User Menu */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              >
                <User size={18} />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                        {profile?.display_name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
