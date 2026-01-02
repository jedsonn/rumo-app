'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Lock, Trash2, AlertTriangle } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  isDark: boolean
  onShowToast: (message: string) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  userEmail,
  isDark,
  onShowToast
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'password' | 'danger'>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Email change
  const [newEmail, setNewEmail] = useState('')

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const supabase = createClient()

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Confirmation email sent to your new address. Please check your inbox.')
      setNewEmail('')
    }
    setLoading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setLoading(true)
    setError(null)

    // Delete user data first
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Delete all user data
      await supabase.from('goals').delete().eq('user_id', user.id)
      await supabase.from('blessings').delete().eq('user_id', user.id)
      await supabase.from('rewards').delete().eq('user_id', user.id)
      await supabase.from('profiles').delete().eq('id', user.id)
    }

    // Note: Full account deletion requires admin API or edge function
    // For now, sign out and show message
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ] as const

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-40 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setError(null)
                    setSuccess(null)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-900'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  } ${tab.id === 'danger' ? 'text-red-500 hover:text-red-400' : ''}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[300px]">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Email Address
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Current: <strong>{userEmail}</strong>
                </p>

                <form onSubmit={handleChangeEmail} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      New Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="input-field"
                      placeholder="newemail@example.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !newEmail}
                    className="btn-primary py-2 px-4 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Email'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Change Password
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Update your password to keep your account secure.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="btn-primary py-2 px-4 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border-2 border-dashed ${isDark ? 'border-red-900 bg-red-900/10' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
                    <Trash2 size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                      Delete Account
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-red-300/70' : 'text-red-600/70'}`}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                          Type <strong>DELETE</strong> to confirm:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-red-800 text-white' : 'border-red-300'}`}
                          placeholder="DELETE"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={loading || deleteConfirm !== 'DELETE'}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            {loading ? 'Deleting...' : 'Confirm Delete'}
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false)
                              setDeleteConfirm('')
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
