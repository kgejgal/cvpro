'use client'

import { useState } from 'react'
import {
  DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabase/client'

const STAGES = [
  { id: 'plan',      label: 'Planuję',         color: '#6B84AA', bg: 'rgba(107,132,170,0.1)' },
  { id: 'sent',      label: 'Wysłałem',         color: '#38BDF8', bg: 'rgba(56,189,248,0.1)' },
  { id: 'interview', label: 'Rozmowa',           color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  { id: 'offer',     label: 'Oferta',            color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  { id: 'rejected',  label: 'Brak odpowiedzi',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)'  },
]

export type Application = {
  id: string
  user_id: string
  company: string
  position: string
  cv_id: string | null
  stage: string
  notes: string
  applied_at: string | null
  created_at: string
}

type CVOption = { id: string; title: string }

function Card({ app, onEdit }: { app: Application; onEdit: (a: Application) => void }) {
  const stage = STAGES.find(s => s.id === app.stage)!
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: app.id, data: { stage: app.stage } })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(app)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: '#162d50',
        border: '1px solid rgba(56,100,200,0.18)',
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'grab',
        userSelect: 'none',
        marginBottom: 8,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, color: '#e2eeff', marginBottom: 3 }}>
        {app.company || '—'}
      </div>
      <div style={{ fontSize: 12, color: '#6B84AA', marginBottom: app.applied_at ? 8 : 0 }}>
        {app.position || 'Brak stanowiska'}
      </div>
      {app.applied_at && (
        <div style={{ fontSize: 11, color: stage.color, marginTop: 6 }}>
          📅 {new Date(app.applied_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
        </div>
      )}
    </div>
  )
}

function Column({
  stage, apps, onEdit,
}: { stage: typeof STAGES[0]; apps: Application[]; onEdit: (a: Application) => void }) {
  const ids = apps.map(a => a.id)
  return (
    <div style={{
      flex: '0 0 200px', minWidth: 200, background: stage.bg,
      border: `1px solid ${stage.color}33`,
      borderRadius: 14, padding: '14px 12px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: stage.color, letterSpacing: '0.04em' }}>{stage.label.toUpperCase()}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, background: `${stage.color}22`, borderRadius: 10, padding: '2px 8px' }}>{apps.length}</span>
      </div>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1, minHeight: 40 }}>
          {apps.map(a => <Card key={a.id} app={a} onEdit={onEdit} />)}
        </div>
      </SortableContext>
    </div>
  )
}

function Modal({
  app, cvs, onClose, onSave, onDelete,
}: {
  app: Application | null
  cvs: CVOption[]
  onClose: () => void
  onSave: (a: Application) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState<Application>(app ?? {
    id: '', user_id: '', company: '', position: '', cv_id: null,
    stage: 'plan', notes: '', applied_at: null, created_at: '',
  })
  const isNew = !app?.id

  if (!app && !isNew) return null

  const set = (k: keyof Application, v: string | null) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(5,12,28,0.88)', zIndex: 200, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#122040', border: '1px solid #1e3f75', borderRadius: 16, padding: '28px 32px', width: 440, maxWidth: '92vw', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#e2eeff', marginBottom: 4 }}>
          {isNew ? 'Nowa aplikacja' : 'Edytuj aplikację'}
        </div>

        {(['company', 'position'] as const).map(k => (
          <div key={k}>
            <label style={{ fontSize: 11, color: '#4a6a99', display: 'block', marginBottom: 5 }}>
              {k === 'company' ? 'Firma' : 'Stanowisko'}
            </label>
            <input
              value={form[k]}
              onChange={e => set(k, e.target.value)}
              style={{ width: '100%', background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#e2eeff', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = '#4477ff' }}
              onBlur={e => { e.target.style.borderColor = '#1e3f75' }}
            />
          </div>
        ))}

        <div>
          <label style={{ fontSize: 11, color: '#4a6a99', display: 'block', marginBottom: 5 }}>Etap</label>
          <select
            value={form.stage}
            onChange={e => set('stage', e.target.value)}
            style={{ width: '100%', background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#e2eeff', outline: 'none', boxSizing: 'border-box' }}
          >
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, color: '#4a6a99', display: 'block', marginBottom: 5 }}>Data wysłania</label>
          <input
            type="date"
            value={form.applied_at ?? ''}
            onChange={e => set('applied_at', e.target.value || null)}
            style={{ width: '100%', background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#e2eeff', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
            onFocus={e => { e.target.style.borderColor = '#4477ff' }}
            onBlur={e => { e.target.style.borderColor = '#1e3f75' }}
          />
        </div>

        {cvs.length > 0 && (
          <div>
            <label style={{ fontSize: 11, color: '#4a6a99', display: 'block', marginBottom: 5 }}>Użyte CV (opcjonalnie)</label>
            <select
              value={form.cv_id ?? ''}
              onChange={e => set('cv_id', e.target.value || null)}
              style={{ width: '100%', background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '9px 12px', fontSize: 14, color: '#e2eeff', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value=''>— Brak —</option>
              {cvs.map(cv => <option key={cv.id} value={cv.id}>{cv.title || 'Bez tytułu'}</option>)}
            </select>
          </div>
        )}

        <div>
          <label style={{ fontSize: 11, color: '#4a6a99', display: 'block', marginBottom: 5 }}>Notatki</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            style={{ width: '100%', background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#e2eeff', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            onFocus={e => { e.target.style.borderColor = '#4477ff' }}
            onBlur={e => { e.target.style.borderColor = '#1e3f75' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => onSave(form)}
            style={{ flex: 1, background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {isNew ? 'Dodaj' : 'Zapisz'}
          </button>
          {!isNew && (
            <button
              onClick={() => onDelete(form.id)}
              style={{ background: 'none', border: '1px solid #5a1a1a', color: '#e55', borderRadius: 9, padding: '10px 16px', fontSize: 13, cursor: 'pointer' }}
            >
              Usuń
            </button>
          )}
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid #1e3f75', color: '#6B84AA', borderRadius: 9, padding: '10px 16px', fontSize: 13, cursor: 'pointer' }}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}

export default function KanbanBoard({
  initialApps, cvs, plan,
}: { initialApps: Application[]; cvs: CVOption[]; plan: string }) {
  const [apps, setApps] = useState<Application[]>(initialApps)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalApp, setModalApp] = useState<Application | null | 'new'>(null)

  const supabase = createClient()

  const FREE_LIMIT = 3
  const isLimited = plan === 'free' && apps.length >= FREE_LIMIT

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function groupByStage() {
    const map: Record<string, Application[]> = {}
    for (const s of STAGES) map[s.id] = []
    for (const a of apps) (map[a.stage] ??= []).push(a)
    return map
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string)
  }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e
    if (!over) return
    const activeApp = apps.find(a => a.id === active.id)
    if (!activeApp) return

    // Detect if over a column id (stage id) or a card id
    const overId = over.id as string
    const overStage = STAGES.find(s => s.id === overId)?.id
      ?? apps.find(a => a.id === overId)?.stage

    if (overStage && activeApp.stage !== overStage) {
      setApps(prev => prev.map(a => a.id === activeApp.id ? { ...a, stage: overStage } : a))
    }
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const activeApp = apps.find(a => a.id === active.id)
    if (!activeApp) return

    const overId = over.id as string
    const newStage = STAGES.find(s => s.id === overId)?.id
      ?? apps.find(a => a.id === overId)?.stage
      ?? activeApp.stage

    // Reorder within same column
    if (active.id !== over.id && activeApp.stage === newStage) {
      setApps(prev => {
        const stageApps = prev.filter(a => a.stage === newStage)
        const others = prev.filter(a => a.stage !== newStage)
        const oldIdx = stageApps.findIndex(a => a.id === active.id)
        const newIdx = stageApps.findIndex(a => a.id === overId)
        if (oldIdx === -1 || newIdx === -1) return prev
        return [...others, ...arrayMove(stageApps, oldIdx, newIdx)]
      })
    }

    // Persist stage change
    if (newStage !== activeApp.stage || true) {
      await supabase.from('applications').update({ stage: newStage }).eq('id', activeApp.id)
    }
  }

  async function handleSave(form: Application) {
    if (form.id) {
      // Update
      const { data } = await supabase
        .from('applications')
        .update({ company: form.company, position: form.position, stage: form.stage, notes: form.notes, applied_at: form.applied_at, cv_id: form.cv_id })
        .eq('id', form.id)
        .select()
        .single()
      if (data) setApps(prev => prev.map(a => a.id === form.id ? data : a))
    } else {
      // Insert
      const { data } = await supabase
        .from('applications')
        .insert({ company: form.company, position: form.position, stage: form.stage, notes: form.notes, applied_at: form.applied_at, cv_id: form.cv_id })
        .select()
        .single()
      if (data) setApps(prev => [...prev, data])
    }
    setModalApp(null)
  }

  async function handleDelete(id: string) {
    await supabase.from('applications').delete().eq('id', id)
    setApps(prev => prev.filter(a => a.id !== id))
    setModalApp(null)
  }

  const grouped = groupByStage()
  const activeApp = apps.find(a => a.id === activeId) ?? null

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>Tracker aplikacji</h1>
          <p style={{ color: '#6B84AA', fontSize: 13, margin: 0 }}>
            {apps.length} aplikacji{plan === 'free' ? ` · limit bezpłatny: ${FREE_LIMIT}` : ''}
          </p>
        </div>
        {isLimited ? (
          <a href="/cennik" style={{ background: '#1e3f75', color: '#6B84AA', textDecoration: 'none', fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 9 }}>
            🔒 Upgrade — więcej aplikacji
          </a>
        ) : (
          <button
            onClick={() => setModalApp('new')}
            style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, padding: '9px 22px', borderRadius: 9, cursor: 'pointer' }}
          >
            + Nowa aplikacja
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, alignItems: 'flex-start' }}>
          {STAGES.map(s => (
            <Column key={s.id} stage={s} apps={grouped[s.id] ?? []} onEdit={a => setModalApp(a)} />
          ))}
        </div>
        <DragOverlay>
          {activeApp && (
            <div style={{
              background: '#162d50', border: '1px solid #4477ff66', borderRadius: 10,
              padding: '12px 14px', cursor: 'grabbing', boxShadow: '0 8px 32px rgba(68,119,255,0.3)',
              width: 190,
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#e2eeff' }}>{activeApp.company}</div>
              <div style={{ fontSize: 12, color: '#6B84AA' }}>{activeApp.position}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {(modalApp === 'new' || (modalApp && typeof modalApp === 'object')) && (
        <Modal
          app={modalApp === 'new' ? null : modalApp as Application}
          cvs={cvs}
          onClose={() => setModalApp(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
