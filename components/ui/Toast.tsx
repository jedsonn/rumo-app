'use client'

import { useDashboard } from '@/components/providers/DashboardProvider'
import { X } from 'lucide-react'

export function Toast() {
  const { toast, clearToast } = useDashboard()

  if (!toast) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
        <span>{toast.message}</span>
        {toast.undoAction && (
          <button
            onClick={() => {
              toast.undoAction?.()
              clearToast()
            }}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Undo
          </button>
        )}
        <button onClick={clearToast} className="text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
