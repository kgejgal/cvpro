'use client'

import { lazy, Suspense, useState } from 'react'
import Link from 'next/link'
import type { CVData } from '@/lib/cv/types'
import { COLOR_THEMES, ALL_TEMPLATES, planAllows } from '@/lib/cv/types'
import ScaledCV from '@/components/cv/ScaledCV'
import { track } from '@/lib/analytics'

const TEMPLATE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<{ data: CVData }>>> = {
  classic:      lazy(() => import('./templates/Classic')),
  modern:       lazy(() => import('./templates/Modern')),
  warsaw:       lazy(() => import('./templates/Warsaw')),
  elegant:      lazy(() => import('./templates/Elegant')),
  bold:         lazy(() => import('./templates/Bold')),
  academic:     lazy(() => import('./templates/Academic')),
  luxury:       lazy(() => import('./templates/Luxury')),
  minimal:      lazy(() => import('./templates/Minimal')),
  professional: lazy(() => import('./templates/Professional')),
  creative:     lazy(() => import('./templates/Creative')),
  startup:      lazy(() => import('./templates/Startup')),
  timeline:     lazy(() => import('./templates/Timeline')),
  technical:    lazy(() => import('./templates/Technical')),
  compact:      lazy(() => import('./templates/Compact')),
  executive:    lazy(() => import('./templates/Executive')),
  nordic:       lazy(() => import('./templates/Nordic')),
}

interface Props {
  data: CVData
  plan: string
  onChange: (patch: Partial<CVData>) => void
  onDownloadPDF: () => void
}

export default function CVPreview({ data, plan, onChange, onDownloadPDF }: Props) {
  const canDownload = plan !== 'free'
  const [lockedId, setLockedId] = useState<string | null>(null)
  const locked = ALL_TEMPLATES.find(t => t.id === lockedId)
  const PLAN_INFO: Record<string, { name: string; price: string }> = {
    basic: { name: 'Podstawowy', price: '15 zł' },
    pro: { name: 'Pro', price: '29 zł' },
    premium: { name: 'Premium', price: '39 zł' },
  }
  const lockedPlan = locked ? PLAN_INFO[locked.minPlan] : undefined
  const TemplateComponent = TEMPLATE_MAP[data.template] ?? TEMPLATE_MAP.classic

  return (
    <div className="no-print" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ background: '#122040', borderBottom: '1px solid #1e3f75', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Template picker */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ALL_TEMPLATES.map(t => {
            const isLocked = !planAllows(plan, t.minPlan)
            const active = data.template === t.id
            return (
              <button
                key={t.id}
                onClick={() => { if (isLocked) { track('template_locked_click', t.id); setLockedId(t.id) } else onChange({ template: t.id as CVData['template'] }) }}
                title={isLocked ? `Wymaga planu ${t.minPlan}` : t.desc}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderColor: active ? data.colorTheme : '#1e3f75',
                  background: active ? data.colorTheme + '22' : 'transparent',
                  color: isLocked ? '#3a5070' : active ? data.colorTheme : '#7a94bb',
                  position: 'relative',
                }}
              >
                {isLocked && <span style={{ marginRight: 4, fontSize: 9 }}>🔒</span>}{t.label}
              </button>
            )
          })}
        </div>

        <div style={{ width: 1, height: 20, background: '#1e3f75' }} />

        {/* Color picker */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {COLOR_THEMES.map(c => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => onChange({ colorTheme: c.value })}
              style={{
                width: 18, height: 18,
                borderRadius: '50%',
                background: c.value,
                border: data.colorTheme === c.value ? '2px solid #fff' : '2px solid transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
          <input
            type="color"
            value={data.colorTheme}
            onChange={e => onChange({ colorTheme: e.target.value })}
            title="Własny kolor"
            style={{ width: 18, height: 18, border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0, background: 'none' }}
          />
        </div>

        <div style={{ width: 1, height: 20, background: '#1e3f75' }} />

        {/* Language */}
        <select
          value={data.language}
          onChange={e => onChange({ language: e.target.value as 'pl' | 'en' })}
          style={{ background: '#0d1c35', color: '#7a94bb', border: '1px solid #1e3f75', borderRadius: 6, padding: '3px 6px', fontSize: 11, cursor: 'pointer' }}
        >
          <option value="pl">🇵🇱 PL</option>
          <option value="en">🇬🇧 EN</option>
        </select>

        <div style={{ marginLeft: 'auto' }}>
          {canDownload ? (
            <button
              onClick={onDownloadPDF}
              style={{ background: '#1e3f75', color: '#e2eeff', border: '1px solid #2d5499', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              ↓ Pobierz PDF
            </button>
          ) : (
            <button
              onClick={onDownloadPDF}
              style={{ background: '#4477ff', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              🔒 Pobierz PDF
            </button>
          )}
        </div>
      </div>

      {/* CV preview */}
      <div className="cv-print-outer" style={{ flex: 1, overflow: 'auto', background: '#122040', padding: '24px 12px 48px' }}>
        <ScaledCV maxScale={0.85}>
          <div style={{ boxShadow: '0 8px 40px #0005', borderRadius: 4, position: 'relative' }}>
            <Suspense fallback={<div style={{ width: 794, minHeight: 1123, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 14 }}>Ładowanie szablonu…</div>}>
              <TemplateComponent data={data} />
            </Suspense>
            {!data.firstName && !data.lastName && !data.summary && data.experience.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 12 }}>
                <div style={{ fontSize: 40, opacity: 0.15 }}>📄</div>
                <div style={{ color: '#aaa', fontSize: 13, opacity: 0.5, textAlign: 'center', maxWidth: 260, lineHeight: 1.5 }}>
                  Wypełnij formularz po lewej,<br />a CV pojawi się tutaj na żywo
                </div>
              </div>
            )}
          </div>
        </ScaledCV>
      </div>
      {locked && lockedPlan && (
        <div role="dialog" aria-label="Szablon w wyższym planie" onClick={() => setLockedId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(5,12,28,0.7)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#122040', border: '1px solid #2d5499', borderRadius: 14, padding: '24px 22px', maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#e2eeff' }}>Szablon &bdquo;{locked.label}&rdquo;</h3>
            <p style={{ margin: '0 0 18px', fontSize: 13.5, color: '#9ab4d8', lineHeight: 1.55 }}>
              Jest dostępny w planie {lockedPlan.name} ({lockedPlan.price}, jednorazowo, bez subskrypcji). Twoje CV zostaje zapisane.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/cennik" style={{ background: '#4477ff', color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Zobacz plany</Link>
              <button onClick={() => setLockedId(null)} style={{ background: 'none', border: '1px solid #2d5499', color: '#9ab4d8', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Zostań przy darmowych</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
