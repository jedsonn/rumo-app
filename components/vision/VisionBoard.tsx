'use client'

import { useState, useRef } from 'react'
import { Plus, X, Link2, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { VisionBoardItem, Goal } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'

interface VisionBoardProps {
  items: VisionBoardItem[]
  onAddItem: (item: Partial<VisionBoardItem>) => Promise<void>
  onUpdateItem: (id: string, updates: Partial<VisionBoardItem>) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
}

export function VisionBoard({ items, onAddItem, onUpdateItem, onDeleteItem }: VisionBoardProps) {
  const { goals, isBlue } = useDashboard()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<VisionBoardItem | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <ImageIcon size={20} className={isBlue ? 'text-blue-500' : 'text-rose-500'} />
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Vision Board</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm ${gradientClass} hover:opacity-90`}
          >
            <Plus size={16} />
            Add Image
          </button>
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="flex-1 overflow-auto p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900"
      >
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <ImageIcon size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">Your Vision Board is Empty</p>
            <p className="text-sm mt-1">Add images that inspire your goals</p>
            <button
              onClick={() => setShowAddModal(true)}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-white ${gradientClass}`}
            >
              <Plus size={18} />
              Add Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <VisionBoardCard
                key={item.id}
                item={item}
                goals={goals}
                onSelect={() => setSelectedItem(item)}
                onDelete={() => onDeleteItem(item.id)}
                isBlue={isBlue}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddVisionItemModal
          goals={goals}
          onAdd={async (data) => {
            await onAddItem(data)
            setShowAddModal(false)
          }}
          onClose={() => setShowAddModal(false)}
          isBlue={isBlue}
        />
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <VisionItemDetailModal
          item={selectedItem}
          goals={goals}
          onUpdate={onUpdateItem}
          onClose={() => setSelectedItem(null)}
          isBlue={isBlue}
        />
      )}
    </div>
  )
}

interface VisionBoardCardProps {
  item: VisionBoardItem
  goals: Goal[]
  onSelect: () => void
  onDelete: () => void
  isBlue: boolean
}

function VisionBoardCard({ item, goals, onSelect, onDelete, isBlue }: VisionBoardCardProps) {
  const linkedGoal = goals.find(g => g.id === item.linked_goal_id)

  return (
    <div
      className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-slate-200 dark:border-slate-700"
      onClick={onSelect}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title || 'Vision board item'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={14} className="text-white" />
      </button>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        {item.title && (
          <h3 className="font-medium text-white text-sm truncate">{item.title}</h3>
        )}
        {linkedGoal && (
          <div className="flex items-center gap-1 mt-1">
            <Link2 size={10} className="text-white/70" />
            <span className="text-[10px] text-white/70 truncate">{linkedGoal.goal}</span>
          </div>
        )}
      </div>

      {/* Category badge */}
      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        item.category === 'Personal'
          ? 'bg-violet-500/80 text-white'
          : 'bg-amber-500/80 text-white'
      }`}>
        {item.category}
      </span>
    </div>
  )
}

interface AddVisionItemModalProps {
  goals: Goal[]
  onAdd: (data: Partial<VisionBoardItem>) => Promise<void>
  onClose: () => void
  isBlue: boolean
}

function AddVisionItemModal({ goals, onAdd, onClose, isBlue }: AddVisionItemModalProps) {
  const [form, setForm] = useState({
    image_url: '',
    title: '',
    description: '',
    category: 'Personal' as 'Personal' | 'Professional',
    linked_goal_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image_url) return

    setLoading(true)
    await onAdd({
      image_url: form.image_url,
      title: form.title || null,
      description: form.description || null,
      category: form.category,
      linked_goal_id: form.linked_goal_id || null,
    })
    setLoading(false)
  }

  const gradientClass = isBlue ? 'gradient-bg' : 'gradient-bg-pink'

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Vision Board Image" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Image URL *
          </label>
          <input
            type="url"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="input-field"
            placeholder="https://..."
            required
          />
          {form.image_url && (
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs text-blue-500 mt-1"
            >
              {preview ? 'Hide preview' : 'Show preview'}
            </button>
          )}
          {preview && form.image_url && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={form.image_url} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder="What does this represent?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows={2}
            placeholder="Why is this inspiring to you?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as 'Personal' | 'Professional' })}
              className="input-field"
            >
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Link to Goal
            </label>
            <select
              value={form.linked_goal_id}
              onChange={(e) => setForm({ ...form, linked_goal_id: e.target.value })}
              className="input-field"
            >
              <option value="">None</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.goal}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !form.image_url}
            className={`px-4 py-2 rounded-lg text-white ${gradientClass} hover:opacity-90 disabled:opacity-50`}
          >
            {loading ? 'Adding...' : 'Add to Vision Board'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface VisionItemDetailModalProps {
  item: VisionBoardItem
  goals: Goal[]
  onUpdate: (id: string, updates: Partial<VisionBoardItem>) => Promise<void>
  onClose: () => void
  isBlue: boolean
}

function VisionItemDetailModal({ item, goals, onUpdate, onClose, isBlue }: VisionItemDetailModalProps) {
  const linkedGoal = goals.find(g => g.id === item.linked_goal_id)

  return (
    <Modal isOpen={true} onClose={onClose} title={item.title || 'Vision Board Item'} size="lg">
      <div className="space-y-4">
        <img
          src={item.image_url}
          alt={item.title || 'Vision board item'}
          className="w-full rounded-lg"
        />

        {item.description && (
          <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
        )}

        {linkedGoal && (
          <div className={`p-3 rounded-lg ${
            isBlue ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
          }`}>
            <div className="flex items-center gap-2 text-sm">
              <Link2 size={14} className={isBlue ? 'text-blue-500' : 'text-rose-500'} />
              <span className="font-medium text-slate-700 dark:text-slate-300">Linked Goal:</span>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{linkedGoal.goal}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded ${
                linkedGoal.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {linkedGoal.status}
              </span>
              <span className="text-slate-500">{linkedGoal.period}</span>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-400 dark:text-slate-500">
          Added on {new Date(item.created_at).toLocaleDateString()}
        </div>
      </div>
    </Modal>
  )
}
