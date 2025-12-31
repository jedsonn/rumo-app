'use client'

import { useState, useRef, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

interface ResizableDividerProps {
  split: number
  onSplitChange: (percentage: number) => void
  themeColor: 'blue' | 'rose'
  isDark: boolean
}

// ResizableDivider - drag to resize columns (matches template EXACTLY)
export function ResizableDivider({ split, onSplitChange, themeColor, isDark }: ResizableDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDoubleClick = () => {
    onSplitChange(50) // Reset to 50/50
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = dividerRef.current?.parentElement
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.min(Math.max((x / rect.width) * 100, 20), 80)
      onSplitChange(percentage)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onSplitChange])

  const activeColor = themeColor === 'blue' ? 'bg-blue-500' : 'bg-rose-500'

  return (
    <div
      ref={dividerRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title="Drag to resize • Double-click to reset 50/50"
      className={`w-3 cursor-col-resize flex-shrink-0 group relative hidden lg:flex items-center justify-center ${
        isDragging ? 'select-none' : ''
      }`}
    >
      <div
        className={`w-1 h-full rounded-full transition-all ${
          isDragging
            ? activeColor
            : (isDark ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-slate-200 group-hover:bg-slate-300')
        }`}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 px-1.5 py-1 rounded flex flex-col items-center justify-center transition-opacity ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
      >
        <GripVertical size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
        <span className={`text-[8px] font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {Math.round(split)}:{Math.round(100 - split)}
        </span>
      </div>
    </div>
  )
}
