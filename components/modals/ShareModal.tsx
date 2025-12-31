'use client'

import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Goal } from '@/lib/types'
import { Twitter, Linkedin, Link2, Check, Download } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  ownerName: string
  year: number
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

export function ShareModal({
  isOpen,
  onClose,
  goal,
  ownerName,
  year,
  themeColor,
  isDark
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  if (!goal) return null

  const shareText = `🎯 I just crushed my ${year} resolution: "${goal.goal}"!\n\n#Goals #${year}Resolutions #Achievement`
  const encodedText = encodeURIComponent(shareText)
  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodedText}`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const gradientClass = themeColor === 'blue'
    ? 'from-blue-500 to-violet-500'
    : 'from-rose-500 to-pink-500'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Achievement 🎉" size="md">
      <div className="space-y-6">
        {/* Preview Card */}
        <div
          ref={cardRef}
          className={`relative p-6 rounded-xl bg-gradient-to-br ${gradientClass} text-white overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 text-6xl">🎯</div>
            <div className="absolute bottom-2 left-2 text-4xl">✨</div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="text-sm font-medium opacity-90 mb-2">
              {ownerName}'s {year} Resolution
            </div>
            <h3 className="text-2xl font-bold mb-3">"{goal.goal}"</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-full">
                ✅ Completed
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full">
                {goal.period.replace('-years', 'yr').replace('-year', 'yr')} goal
              </span>
            </div>
            {goal.action && (
              <p className="mt-3 text-sm opacity-80">
                Key action: {goal.action}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
              Track your resolutions at rumo.app
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Share your achievement:
          </p>

          <div className="flex gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
            >
              <Twitter size={20} />
              <span className="font-medium">Twitter</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0077B5] text-white hover:bg-[#006399] transition-colors"
            >
              <Linkedin size={20} />
              <span className="font-medium">LinkedIn</span>
            </a>
          </div>

          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} className="text-green-500" />
                <span className="font-medium text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Link2 size={20} />
                <span className="font-medium">Copy to clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* Preview Text */}
        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <p className={`text-sm whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {shareText}
          </p>
        </div>
      </div>
    </Modal>
  )
}
