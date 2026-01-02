'use client'

import { Modal } from '@/components/ui/Modal'
import { AlertTriangle, Trash2, Info } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
  isDark?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  isDark = false
}: ConfirmModalProps) {
  const icons = {
    danger: Trash2,
    warning: AlertTriangle,
    info: Info
  }

  const colors = {
    danger: {
      icon: 'text-red-500',
      iconBg: isDark ? 'bg-red-900/50' : 'bg-red-100',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-amber-500',
      iconBg: isDark ? 'bg-amber-900/50' : 'bg-amber-100',
      button: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: 'text-blue-500',
      iconBg: isDark ? 'bg-blue-900/50' : 'bg-blue-100',
      button: 'bg-blue-500 hover:bg-blue-600',
    }
  }

  const Icon = icons[variant]
  const colorScheme = colors[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center py-4">
        <div className={`w-16 h-16 rounded-full ${colorScheme.iconBg} flex items-center justify-center mx-auto mb-4`}>
          <Icon size={32} className={colorScheme.icon} />
        </div>

        <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h2>

        <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 ${colorScheme.button}`}
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
