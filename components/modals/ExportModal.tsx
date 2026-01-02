'use client'

import { Modal } from '@/components/ui/Modal'
import { Goal, Blessing, Reward } from '@/lib/types'
import { goalsToCSV, blessingsToCSV, rewardsToCSV, downloadCSV, exportAllData } from '@/lib/export'
import { Download, FileSpreadsheet, FileJson, Target, Heart, Gift } from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  goals: Goal[]
  blessings: Blessing[]
  rewards: Reward[]
  year: number
  isDark: boolean
}

export function ExportModal({
  isOpen,
  onClose,
  goals,
  blessings,
  rewards,
  year,
  isDark
}: ExportModalProps) {
  const yearGoals = goals.filter(g => g.year === year)

  const handleExportGoalsCSV = () => {
    const csv = goalsToCSV(yearGoals)
    downloadCSV(csv, `myresolve-goals-${year}.csv`)
  }

  const handleExportAllGoalsCSV = () => {
    const csv = goalsToCSV(goals)
    downloadCSV(csv, `myresolve-all-goals.csv`)
  }

  const handleExportBlessingsCSV = () => {
    const csv = blessingsToCSV(blessings)
    downloadCSV(csv, `myresolve-blessings.csv`)
  }

  const handleExportRewardsCSV = () => {
    const csv = rewardsToCSV(rewards)
    downloadCSV(csv, `myresolve-rewards.csv`)
  }

  const handleExportAllJSON = () => {
    exportAllData(goals, blessings, rewards)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data" size="md">
      <div className="space-y-4">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Export your data as CSV or JSON for backup or analysis.
        </p>

        {/* CSV Exports */}
        <div>
          <h3 className={`text-sm font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <FileSpreadsheet size={14} />
            Export as CSV
          </h3>

          <div className="space-y-2">
            <button
              onClick={handleExportGoalsCSV}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                isDark
                  ? 'border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Target size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Goals ({year})
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {yearGoals.length} goals
                  </div>
                </div>
              </div>
              <Download size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            </button>

            <button
              onClick={handleExportAllGoalsCSV}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                isDark
                  ? 'border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Target size={18} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    All Goals (All Years)
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {goals.length} goals
                  </div>
                </div>
              </div>
              <Download size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            </button>

            <button
              onClick={handleExportBlessingsCSV}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                isDark
                  ? 'border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart size={18} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Blessings
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {blessings.length} blessings
                  </div>
                </div>
              </div>
              <Download size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            </button>

            <button
              onClick={handleExportRewardsCSV}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                isDark
                  ? 'border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Gift size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
                <div className="text-left">
                  <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Rewards
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {rewards.length} rewards
                  </div>
                </div>
              </div>
              <Download size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            </button>
          </div>
        </div>

        {/* JSON Export */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className={`text-sm font-bold uppercase mb-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <FileJson size={14} />
            Full Backup
          </h3>

          <button
            onClick={handleExportAllJSON}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 border-dashed transition-all ${
              isDark
                ? 'border-slate-600 hover:border-blue-500 bg-slate-800/50'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <FileJson size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div className="text-left">
                <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Export Everything (JSON)
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Complete backup of all your data
                </div>
              </div>
            </div>
            <Download size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </button>
        </div>
      </div>
    </Modal>
  )
}
