'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import {
  Moon, Sun, Palette, BarChart3, Trophy, Trash2,
  ArrowUpDown, Search, LogOut, User
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
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-serif text-lg font-semibold ${gradientClass}`}>
                  {displayName}'s
                </span>
                <span className="font-serif text-lg font-semibold text-slate-800 dark:text-slate-100">Goals</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Set your direction</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 md:gap-1">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
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
              onClick={onShowReview}
              className="hidden sm:block p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              title="Year-End Review"
            >
              <Trophy size={18} />
            </button>
            <button
              onClick={onShowClearAll}
              className="hidden sm:block p-1.5 md:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-500"
              title="Clear All"
            >
              <Trash2 size={18} />
            </button>

            {/* User Menu */}
            <div className="relative ml-2">
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

        {/* Bottom Row - Filters */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Year Selector */}
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-2 md:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 min-w-[120px] max-w-xs">
            <Search size={16} className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 md:pl-9 pr-2 md:pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 md:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
            <option value="dropped">Dropped</option>
          </select>

          {/* Period Filter */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="hidden sm:block px-2 md:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm"
          >
            <option value="all">All Periods</option>
            <option value="One-year">1-Year</option>
            <option value="Three-years">3-Year</option>
            <option value="Five-years">5-Year</option>
          </select>
        </div>
      </div>
    </header>
  )
}
