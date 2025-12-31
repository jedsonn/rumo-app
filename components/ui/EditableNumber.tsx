'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface EditableNumberProps {
  value: number
  onChange: (value: number) => void
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// EditableNumber - goal number with arrows (matches template EXACTLY)
export function EditableNumber({ value, onChange, themeColor, isDark }: EditableNumberProps) {
  const [editing, setEditing] = useState(false)
  const [tempVal, setTempVal] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select()
  }, [editing])

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={tempVal}
        onChange={e => setTempVal(e.target.value)}
        onBlur={() => { onChange(parseInt(tempVal) || 1); setEditing(false) }}
        onKeyDown={e => {
          if (e.key === 'Enter') { onChange(parseInt(tempVal) || 1); setEditing(false) }
          if (e.key === 'Escape') setEditing(false)
        }}
        className={`w-10 text-center text-[10px] font-mono border-2 rounded px-1 py-0.5 focus:outline-none ${
          isDark
            ? `bg-slate-700 border-${themeColor}-500 text-white`
            : `bg-white border-${themeColor}-400`
        }`}
        autoFocus
      />
    )
  }

  return (
    <div className="flex items-center gap-0.5 group/num">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`opacity-0 group-hover/num:opacity-100 p-0.5 ${
          isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <ChevronDown size={10} />
      </button>
      <span
        onClick={() => { setTempVal(value.toString()); setEditing(true) }}
        className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer min-w-[24px] text-center ${
          isDark
            ? `text-${themeColor}-400 bg-${themeColor}-900/50 hover:bg-${themeColor}-900`
            : `text-${themeColor}-500 bg-${themeColor}-50 hover:bg-${themeColor}-100`
        }`}
        title="Click to edit, arrows to adjust"
      >
        #{value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className={`opacity-0 group-hover/num:opacity-100 p-0.5 ${
          isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <ChevronUp size={10} />
      </button>
    </div>
  )
}
