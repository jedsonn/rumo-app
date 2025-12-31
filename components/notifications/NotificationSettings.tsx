'use client'

import { useState, useEffect } from 'react'
import { NotificationPreferences, getNotificationPreferences, saveNotificationPreferences } from '@/lib/notifications'
import { Mail, Bell, Calendar, PartyPopper, Clock, AlertCircle } from 'lucide-react'

interface NotificationSettingsProps {
  isBlue: boolean
  onSave?: () => void
}

export function NotificationSettings({ isBlue, onSave }: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences())
  const [saved, setSaved] = useState(false)

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  const updatePref = <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
    setPrefs(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    saveNotificationPreferences(prefs)
    setSaved(true)
    onSave?.()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={prefs.email}
            onChange={(e) => updatePref('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          We'll send notifications to this email address
        </p>
      </div>

      {/* Weekly Digest */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Weekly Digest</h4>
              <p className="text-xs text-slate-500">Summary of your progress</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.weeklyDigest}
              onChange={(e) => updatePref('weeklyDigest', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-500"></div>
          </label>
        </div>
        {prefs.weeklyDigest && (
          <div className="ml-11">
            <label className="text-xs text-slate-500 mb-1 block">Send on</label>
            <select
              value={prefs.weeklyDigestDay}
              onChange={(e) => updatePref('weeklyDigestDay', e.target.value as 'sunday' | 'monday')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="sunday">Sunday morning</option>
              <option value="monday">Monday morning</option>
            </select>
          </div>
        )}
      </div>

      {/* Goal Reminders */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Bell size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Goal Reminders</h4>
              <p className="text-xs text-slate-500">Gentle nudges to check your goals</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.reminderEnabled}
              onChange={(e) => updatePref('reminderEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
          </label>
        </div>
        {prefs.reminderEnabled && (
          <div className="ml-11">
            <label className="text-xs text-slate-500 mb-1 block">Frequency</label>
            <select
              value={prefs.reminderFrequency}
              onChange={(e) => updatePref('reminderFrequency', e.target.value as 'daily' | 'every3days' | 'weekly')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="every3days">Every 3 days</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
      </div>

      {/* Inactivity Nudge */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
              <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Inactivity Nudge</h4>
              <p className="text-xs text-slate-500">Re-engagement if you've been away</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.inactivityNudge}
              onChange={(e) => updatePref('inactivityNudge', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-rose-500"></div>
          </label>
        </div>
        {prefs.inactivityNudge && (
          <div className="ml-11">
            <label className="text-xs text-slate-500 mb-1 block">After</label>
            <select
              value={prefs.inactivityDays}
              onChange={(e) => updatePref('inactivityDays', parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
            </select>
          </div>
        )}
      </div>

      {/* Celebrate Wins */}
      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <PartyPopper size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Celebrate Wins</h4>
              <p className="text-xs text-slate-500">Get notified when you complete goals</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.celebrateWins}
              onChange={(e) => updatePref('celebrateWins', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!prefs.email}
        className={`w-full py-3 rounded-xl text-white ${gradientClass} hover:opacity-90 disabled:opacity-50 font-medium flex items-center justify-center gap-2`}
      >
        {saved ? (
          <>Saved!</>
        ) : (
          <>
            <Mail size={18} />
            Save Notification Preferences
          </>
        )}
      </button>

      {/* Demo Notice */}
      <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Demo Mode:</strong> Email notifications are simulated. In the full app, these settings would configure real email delivery.
        </p>
      </div>
    </div>
  )
}
