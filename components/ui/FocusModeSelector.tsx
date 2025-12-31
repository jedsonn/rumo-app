'use client'

import { useState, useRef, useEffect } from 'react'
import { FocusMode, FOCUS_MODE_LABELS } from '@/lib/types'
import { Focus, ChevronDown, Check } from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'

interface FocusModeSelectorProps {
  value: FocusMode
  onChange: (mode: FocusMode) => void
}

export function FocusModeSelector({ value, onChange }: FocusModeSelectorProps) {
  const { isBlue } = useDashboard()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const modes: FocusMode[] = ['all', 'active', 'pinned', 'this-week', 'stale']
  const currentLabel = FOCUS_MODE_LABELS[value]

  const themeColor = isBlue ? 'blue' : 'rose'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          value === 'all'
            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            : `text-${themeColor}-600 dark:text-${themeColor}-400 bg-${themeColor}-50 dark:bg-${themeColor}-900/30`
        }`}
      >
        <Focus size={16} />
        <span>{currentLabel.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-slide-up">
          {modes.map((mode) => {
            const modeInfo = FOCUS_MODE_LABELS[mode]
            const isSelected = mode === value

            return (
              <button
                key={mode}
                onClick={() => {
                  onChange(mode)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? `bg-${themeColor}-50 dark:bg-${themeColor}-900/30`
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isSelected
                    ? `bg-${themeColor}-500 text-white`
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {isSelected && <Check size={12} />}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    isSelected
                      ? `text-${themeColor}-600 dark:text-${themeColor}-400`
                      : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {modeInfo.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {modeInfo.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
