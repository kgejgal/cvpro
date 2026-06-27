'use client'

import { lazy, Suspense } from 'react'
import type { CVData } from '@/lib/cv/types'
import { COLOR_THEMES, ALL_TEMPLATES, planAllows } from '@/lib/cv/types'

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
  const TemplateComponent = TEMPLATE_MAP[data.template] ?? TEMPLATE_MAP.classic

  return (
    <div className="no-print" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ background: '#122040', borderBottom: '1px solid #1e3f75', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Template picker */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ALL_TEMPLATES.map(t => {
            const locked = !planAllows(plan, t.minPlan)
            const active = data.template === t.id
            return (
              <button
                key={t.id}
                onClick={() => !locked && onChange({ template: t.id as CVData['template'] })}
                title={locked ? `Wymaga planu ${t.minPlan}` : t.desc}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  borderColor: active ? data.colorTheme : '#1e3f75',
                  background: active ? data.colorTheme + '22' : 'transparent',
                  color: locked ? '#3a5070' : active ? data.colorTheme : '#7a94bb',
                  position: 'relative',
                }}
              >
                {locked && <span style={{ marginRight: 4, fontSize: 9 }}>🔒</span>}{t.label}
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
      <div className="cv-print-outer" style={{ flex: 1, overflow: 'auto', background: '#122040', padding: '24px 24px 48px' }}>
        <div className="cv-scale-wrapper" style={{ transform: 'scale(0.85)', transformOrigin: 'top center', display: 'flex', justifyContent: 'center' }}>
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
        </div>
      </div>
    </div>
  )
}
