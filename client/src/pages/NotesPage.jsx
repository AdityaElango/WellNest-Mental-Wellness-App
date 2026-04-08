import { useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, PlusCircle, Save, Search, Tag, Trash2, FileText } from 'lucide-react'
import api, { invalidateCache } from '../services/api'
import AppShell from '../components/AppShell.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function NotesPage() {
  const { push } = useToast()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ title: '', content: '', tagsInput: '' })
  const [autosaveLabel, setAutosaveLabel] = useState('')
  const [hasDraftChanges, setHasDraftChanges] = useState(false)
  const autosaveTimerRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const parseTags = (value) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

  const draftTags = useMemo(() => parseTags(draft.tagsInput), [draft.tagsInput])

  const loadNotes = async () => {
    const { data } = await api.get('/api/notes', { params: { q: debouncedQuery } })
    setItems(data.items || data.content || [])
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setLoading(true)
    loadNotes()
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  const createNote = async (e) => {
    e.preventDefault()
    await api.post('/api/notes', { title, content, tags: parseTags(tagsInput) })
    invalidateCache('/api/notes')
    setTitle('')
    setContent('')
    setTagsInput('')
    await loadNotes()
    push('Note created', 'success')
  }

  const removeNote = async (id) => {
    await api.delete(`/api/notes/${id}`)
    invalidateCache('/api/notes')
    if (editingId === id) {
      setEditingId(null)
      setAutosaveLabel('')
    }
    await loadNotes()
    push('Note deleted', 'success')
  }

  const startEditing = (note) => {
    setEditingId(note.id)
    setDraft({
      title: note.title || '',
      content: note.content || '',
      tagsInput: (note.tags || []).join(', '),
    })
    setHasDraftChanges(false)
    setAutosaveLabel('Editing')
  }

  const saveDraft = async () => {
    if (!editingId) return
    setAutosaveLabel('Saving...')
    await api.put(`/api/notes/${editingId}`, {
      title: draft.title,
      content: draft.content,
      tags: draftTags,
    })
    invalidateCache('/api/notes')
    setAutosaveLabel('Saved')
    setHasDraftChanges(false)
    await loadNotes()
    push('Note saved', 'success')
  }

  useEffect(() => {
    if (!editingId || !hasDraftChanges) return
    clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      saveDraft().catch(() => setAutosaveLabel('Save failed'))
    }, 800)
    return () => clearTimeout(autosaveTimerRef.current)
  }, [draft, editingId, hasDraftChanges])

  return (
    <AppShell title="Notes">
      <div className="card mb-5 p-5">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search title, content, tags..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <form onSubmit={createNote} className="space-y-3">
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="input min-h-24" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="relative">
            <Tag className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder="Tags: work, mindfulness, journal" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </div>
          <button className="btn-primary">
            <PlusCircle className="h-4 w-4" />
            Add note
          </button>
        </form>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && (
          <>
        {items.map((note) => (
          <article key={note.id} className="card p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-slate-800">{note.title}</h2>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => startEditing(note)}
                  aria-label="Edit note"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeNote(note.id)}
                  aria-label="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editingId === note.id ? (
              <div className="space-y-2">
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) => {
                    setDraft((prev) => ({ ...prev, title: e.target.value }))
                    setHasDraftChanges(true)
                    setAutosaveLabel('Auto-saving...')
                  }}
                />
                <textarea
                  className="input min-h-24"
                  value={draft.content}
                  onChange={(e) => {
                    setDraft((prev) => ({ ...prev, content: e.target.value }))
                    setHasDraftChanges(true)
                    setAutosaveLabel('Auto-saving...')
                  }}
                />
                <input
                  className="input"
                  value={draft.tagsInput}
                  onChange={(e) => {
                    setDraft((prev) => ({ ...prev, tagsInput: e.target.value }))
                    setHasDraftChanges(true)
                    setAutosaveLabel('Auto-saving...')
                  }}
                  placeholder="Tags separated by commas"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{autosaveLabel}</p>
                  <button className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition hover:bg-slate-50" onClick={() => saveDraft()}>
                    <Save className="h-3.5 w-3.5" />
                    Save now
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-slate-600">{note.content}</p>
                {(note.tags || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span key={`${note.id}-${tag}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </article>
        ))}
          </>
        )}
      </div>
      {!loading && items.length === 0 && (
        <div className="empty-state mt-4">
          <FileText className="mb-3 h-8 w-8 text-slate-400" />
          <h3 className="font-display text-lg font-semibold text-slate-700">No notes found</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first note or refine search to see matching content.</p>
        </div>
      )}
      {debouncedQuery !== query && (
        <p className="mt-3 text-xs text-slate-500">Searching...</p>
      )}
    </AppShell>
  )
}
