'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import {
  Moon, Sun, Palette, BarChart3, Trophy, Trash2,
  Upload, Download, Search, Target, Heart, Gift, Check, X
} from 'lucide-react'

export type TabType = 'goals' | 'blessings' | 'rewards'

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
    logout
  } = useDashboard()

  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [editName, setEditName] = useState(profile?.display_name || '')
  const [editYear, setEditYear] = useState(year)

  const gradientClass = isBlue ? 'gradient-text' : 'gradient-text-pink'
  const displayName = profile?.display_name || 'My'

  const handleSaveHeader = async () => {
    if (editName.trim()) {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase
        .from('profiles')
        .update({ display_name: editName.trim() })
        .eq('id', profile?.id)
    }
    setYear(editYear)
    setIsEditingHeader(false)
    if (editName.trim() && editName !== displayName) {
      window.location.reload()
    }
  }

  return (
    <header className={`border-b shadow-sm px-4 py-3 sticky top-0 z-40 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
      <div className="flex justify-between items-center relative">
        {/* Left: Action buttons */}
        <div className="flex gap-1.5 items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDark ? 'bg-slate-700 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isBlue ? 'bg-blue-100 text-blue-500' : 'bg-rose-100 text-rose-500'}`}
            title="Toggle theme color"
          >
            <Palette size={18} />
          </button>
          <button
            onClick={onShowImportExport}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            title="Import"
          >
            <Upload size={18} />
          </button>
          <button
            onClick={onShowStats}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            title="Stats Dashboard"
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={onShowClearAll}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-red-900/50 text-slate-400 hover:text-red-400' : 'hover:bg-red-100 text-slate-500 hover:text-red-500'}`}
            title="Clear All Data"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Center: Title and Tabs */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          {/* Editable Title */}
          <div
            className="group cursor-pointer mb-1.5"
            onClick={() => {
              setEditName(displayName === 'My' ? '' : displayName)
              setEditYear(year)
              setIsEditingHeader(true)
            }}
          >
            {isEditingHeader ? (
              <div className={`flex gap-2 items-center p-2 rounded-xl shadow-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Name"
                  className={`border rounded px-2 py-1 w-24 text-center font-bold text-sm ${isDark ? 'bg-slate-600 border-slate-500 text-white' : 'border-slate-300'}`}
                  autoFocus
                />
                <input
                  type="number"
                  value={editYear}
                  onChange={e => setEditYear(parseInt(e.target.value) || year)}
                  className={`border rounded px-2 py-1 w-16 text-center font-bold text-sm ${isDark ? 'bg-slate-600 border-slate-500 text-white' : 'border-slate-300'}`}
                />
                <button
                  onClick={handleSaveHeader}
                  className={`p-1 rounded text-white ${isBlue ? 'bg-blue-500' : 'bg-rose-500'}`}
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditingHeader(false)}
                  className="p-1 rounded bg-slate-400 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <h1 className={`text-lg font-serif font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <span className={gradientClass}>{displayName}&apos;s</span> Goals {year}
              </h1>
            )}
          </div>

          {/* Tabs */}
          <div className={`flex gap-1 p-0.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                activeTab === 'goals'
                  ? `${isDark ? 'bg-slate-600 shadow' : 'bg-white shadow'} ${isBlue ? 'text-blue-600' : 'text-rose-600'}`
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Target size={12} /> Goals
            </button>
            <button
              onClick={() => setActiveTab('blessings')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                activeTab === 'blessings'
                  ? `${isDark ? 'bg-slate-600 shadow' : 'bg-white shadow'} text-amber-600`
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Heart size={12} /> Blessings
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                activeTab === 'rewards'
                  ? `${isDark ? 'bg-slate-600 shadow' : 'bg-white shadow'} text-emerald-600`
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Gift size={12} /> Rewards
            </button>
          </div>
        </div>

        {/* Right: Search, Filters, Review */}
        <div className="flex gap-1.5 items-center">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className={`pl-8 pr-3 py-1.5 border rounded-full text-sm w-32 focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500'
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Status Filter */}
          <div className={`flex p-0.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'done', label: 'Done' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                  statusFilter === opt.value
                    ? `${isDark ? 'bg-slate-600 shadow' : 'bg-white shadow'} ${
                        opt.value === 'done' ? 'text-emerald-600' : opt.value === 'active' ? 'text-blue-600' : (isDark ? 'text-slate-200' : 'text-slate-700')
                      }`
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Period Filter */}
          <div className={`flex p-0.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            {[
              { value: 'all', label: 'All' },
              { value: 'One-year', label: '1yr', color: 'sky' },
              { value: 'Three-years', label: '3yr', color: 'amber' },
              { value: 'Five-years', label: '5yr', color: 'violet' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriodFilter(opt.value)}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                  periodFilter === opt.value
                    ? opt.color
                      ? `${isDark ? `bg-${opt.color}-900/50 text-${opt.color}-400` : `bg-${opt.color}-100 text-${opt.color}-700`} shadow`
                      : `${isDark ? 'bg-slate-600 shadow text-slate-200' : 'bg-white shadow text-slate-700'}`
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Review Button */}
          <button
            onClick={onShowReview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-white text-sm ${isBlue ? 'bg-blue-500 hover:bg-blue-600' : 'bg-rose-500 hover:bg-rose-600'}`}
          >
            <Trophy size={14} /> Review
          </button>
        </div>
      </div>
    </header>
  )
}
