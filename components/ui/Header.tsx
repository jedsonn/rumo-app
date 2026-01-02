'use client'

import { useState } from 'react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import {
  Moon, Sun, Palette, BarChart3, Trophy, Trash2,
  Download, Search, Check
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

// Header - matches template.html EXACTLY
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
  } = useDashboard()

  const [editingHeader, setEditingHeader] = useState(false)
  const [ownerName, setOwnerName] = useState(profile?.display_name || 'My')
  const [currentYear, setCurrentYear] = useState(year)

  const themeColor = isBlue ? 'blue' : 'rose'

  const handleSaveHeader = async () => {
    if (ownerName.trim()) {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase
        .from('profiles')
        .update({ display_name: ownerName.trim() })
        .eq('id', profile?.id)
    }
    setYear(currentYear)
    setEditingHeader(false)
    if (ownerName.trim() && ownerName !== (profile?.display_name || 'My')) {
      window.location.reload()
    }
  }

  return (
    <div className={`border-b shadow-sm px-4 py-3 flex-none flex justify-between items-center relative z-20 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
      {/* Left buttons */}
      <div className="flex gap-1.5 items-center">
        <button onClick={toggleDarkMode} className={`p-2 rounded-full ${isDark ? 'bg-slate-700 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`} title="Toggle Dark Mode">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={toggleTheme} className={`p-2 rounded-full ${isBlue ? 'bg-blue-100 text-blue-500' : 'bg-rose-100 text-rose-500'}`} title="Toggle Theme">
          <Palette size={18} />
        </button>
        <button onClick={onShowImportExport} className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`} title="Export Data">
          <Download size={18} />
        </button>
        <button onClick={onShowStats} className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`} title="Stats Dashboard">
          <BarChart3 size={18} />
        </button>
        <button onClick={onShowClearAll} className={`p-2 rounded-full ${isDark ? 'hover:bg-red-900/50 text-slate-400 hover:text-red-400' : 'hover:bg-red-100 text-slate-500 hover:text-red-500'}`} title="Clear All Goals">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Center: Title + Tabs (absolutely positioned) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="group cursor-pointer mb-1.5" onClick={() => setEditingHeader(true)}>
          {editingHeader ? (
            <div className={`flex gap-2 items-center p-2 rounded-xl shadow-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className={`border rounded px-2 py-1 w-20 text-center font-bold text-sm ${isDark ? 'bg-slate-600 border-slate-500 text-white' : ''}`}
                autoFocus
              />
              <input
                type="number"
                value={currentYear}
                onChange={e => setCurrentYear(parseInt(e.target.value) || year)}
                className={`border rounded px-2 py-1 w-16 text-center font-bold text-sm ${isDark ? 'bg-slate-600 border-slate-500 text-white' : ''}`}
              />
              <button onClick={e => { e.stopPropagation(); handleSaveHeader(); }} className={`p-1 bg-${themeColor}-500 text-white rounded`}>
                <Check size={14} />
              </button>
            </div>
          ) : (
            <h1 className={`text-lg font-serif font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {ownerName}&apos;s Goals {currentYear}
            </h1>
          )}
        </div>
        {/* Tabs with emojis - matches template exactly */}
        <div className={`flex gap-1 p-0.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTab === 'goals'
                ? (isDark ? `bg-slate-600 shadow text-${themeColor}-400` : `bg-white shadow text-${themeColor}-600`)
                : (isDark ? 'text-slate-400' : 'text-slate-500')
            }`}
          >
            🎯 Goals
          </button>
          <button
            onClick={() => setActiveTab('blessings')}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTab === 'blessings'
                ? (isDark ? 'bg-slate-600 shadow text-amber-400' : 'bg-white shadow text-amber-600')
                : (isDark ? 'text-slate-400' : 'text-slate-500')
            }`}
          >
            🙏 Blessings
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTab === 'rewards'
                ? (isDark ? 'bg-slate-600 shadow text-emerald-400' : 'bg-white shadow text-emerald-600')
                : (isDark ? 'text-slate-400' : 'text-slate-500')
            }`}
          >
            🎁 Rewards
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex gap-1.5 items-center">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className={`pl-8 pr-3 py-1.5 border rounded-full text-sm w-32 focus:outline-none focus:ring-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500' : 'focus:ring-blue-500'}`}
          />
        </div>

        {/* Status Filter */}
        <div className={`flex p-0.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <button onClick={() => setStatusFilter('all')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${statusFilter === 'all' ? (isDark ? 'bg-slate-600 shadow text-slate-200' : 'bg-white shadow text-slate-700') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>All</button>
          <button onClick={() => setStatusFilter('active')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${statusFilter === 'active' ? (isDark ? 'bg-slate-600 shadow text-blue-400' : 'bg-white shadow text-blue-600') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>Active</button>
          <button onClick={() => setStatusFilter('done')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${statusFilter === 'done' ? (isDark ? 'bg-slate-600 shadow text-emerald-400' : 'bg-white shadow text-emerald-600') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>Done</button>
        </div>

        {/* Period Filter */}
        <div className={`flex p-0.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <button onClick={() => setPeriodFilter('all')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${periodFilter === 'all' ? (isDark ? 'bg-slate-600 shadow text-slate-200' : 'bg-white shadow text-slate-700') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>All</button>
          <button onClick={() => setPeriodFilter('One-year')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${periodFilter === 'One-year' ? (isDark ? 'bg-sky-900/50 shadow text-sky-400' : 'bg-sky-100 shadow text-sky-700') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>1yr</button>
          <button onClick={() => setPeriodFilter('Three-years')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${periodFilter === 'Three-years' ? (isDark ? 'bg-amber-900/50 shadow text-amber-400' : 'bg-amber-100 shadow text-amber-700') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>3yr</button>
          <button onClick={() => setPeriodFilter('Five-years')} className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${periodFilter === 'Five-years' ? (isDark ? 'bg-violet-900/50 shadow text-violet-400' : 'bg-violet-100 shadow text-violet-700') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>5yr</button>
        </div>

        {/* Review Button */}
        <button onClick={onShowReview} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-white text-sm ${isBlue ? 'bg-blue-500' : 'bg-rose-500'}`}>
          <Trophy size={14} /> Review
        </button>
      </div>
    </div>
  )
}
