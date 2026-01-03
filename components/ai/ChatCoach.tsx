'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Trash2, Sparkles } from 'lucide-react'
import { AIChatMessage } from '@/lib/types'

interface ChatCoachProps {
  themeColor: 'blue' | 'rose'
  isDark: boolean
  onGoalAdded?: () => void
}

export function ChatCoach({ themeColor, isDark, onGoalAdded }: ChatCoachProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AIChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory()
    }
  }, [isOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/ai/chat')
      const data = await response.json()
      if (data.success && data.messages) {
        setMessages(data.messages)
      }
    } catch (err) {
      console.error('Failed to load chat history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // Optimistically add user message
    const tempUserMsg: AIChatMessage = {
      id: `temp-${Date.now()}`,
      user_id: '',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMsg])
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      // Add assistant response
      const assistantMsg: AIChatMessage = {
        id: `temp-${Date.now()}-assistant`,
        user_id: '',
        role: 'assistant',
        content: data.message,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])

      // If a goal was added, trigger refresh
      if (data.addedGoal && onGoalAdded) {
        onGoalAdded()
      }
    } catch (err) {
      // Add error message with details
      const errorContent = err instanceof Error
        ? `Sorry, I encountered an error: ${err.message}`
        : 'Sorry, I encountered an error. Please try again.'
      const errorMsg: AIChatMessage = {
        id: `temp-${Date.now()}-error`,
        user_id: '',
        role: 'assistant',
        content: errorContent,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = async () => {
    try {
      await fetch('/api/ai/chat', { method: 'DELETE' })
      setMessages([])
    } catch (err) {
      console.error('Failed to clear history:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const buttonGradient = themeColor === 'blue' ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40 ${buttonGradient}`}
        title="AI Coach"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <Sparkles className="w-3 h-3 text-white absolute -top-0.5 -right-0.5" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={`fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden ${
          isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          {/* Header */}
          <div className={`px-4 py-3 flex items-center justify-between ${buttonGradient}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">Resolve - AI Coach</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            isDark ? 'bg-slate-900' : 'bg-slate-50'
          }`}>
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className={`w-6 h-6 animate-spin ${
                  themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'
                }`} />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className={`w-12 h-12 mx-auto mb-4 ${
                  themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'
                }`} />
                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Hi! I'm Resolve, your AI coach.
                </p>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ask me anything about your goals, motivation, or productivity!
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'How can I stay motivated?',
                    'Which goal should I focus on?',
                    'Help me break down my top goal',
                  ].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-white hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? (themeColor === 'blue'
                          ? 'bg-blue-500 text-white'
                          : 'bg-rose-500 text-white')
                        : (isDark
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-white text-slate-700 shadow-sm')
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className={`px-4 py-2 rounded-2xl ${
                  isDark ? 'bg-slate-800' : 'bg-white shadow-sm'
                }`}>
                  <Loader2 className={`w-5 h-5 animate-spin ${
                    themeColor === 'blue' ? 'text-blue-500' : 'text-rose-500'
                  }`} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your coach..."
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 ${
                  isDark
                    ? `bg-slate-800 text-white placeholder-slate-500 focus:ring-${themeColor}-500`
                    : `bg-slate-100 text-slate-800 placeholder-slate-400 focus:ring-${themeColor}-400`
                }`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`p-2 rounded-full transition-colors disabled:opacity-50 ${buttonGradient}`}
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
