'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SITUATION_CHIPS, ALL_TEMPLATES } from '@/lib/cv/types'
import type { CVData } from '@/lib/cv/types'

interface Props {
  onComplete: (patch: Partial<CVData>) => void
  plan: string
}

const STORAGE_KEY = 'cvpro_onboarded'

export default function OnboardingWizard({ onComplete, plan }: Props) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [situation, setSituation] = useState('')
  const [template, setTemplate] = useState('classic')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return
    // Pre-fill name from Supabase user metadata if available
    createClient().auth.getUser().then(({ data: { user } }) => {
      const meta = user?.user_metadata
      if (meta?.full_name) {
        const parts = (meta.full_name as string).split(' ')
        setFirstName(parts[0] ?? '')
        setLastName(parts.slice(1).join(' ') ?? '')
      } else if (user?.email) {
        // Use email prefix as fallback first name hint
        setFirstName(user.email.split('@')[0] ?? '')
      }
    })
    setVisible(true)
  }, [])

  function finish() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
    const patch: Partial<CVData> = { template: template as CVData['template'] }
    if (situation) patch.situation = situation
    if (firstName) patch.firstName = firstName
    if (lastName) patch.lastName = lastName
    onComplete(patch)
  }

  function skip() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  const freeTemplates = ALL_TEMPLATES.filter(t => t.minPlan === 'free')
  const availableTemplates = ALL_TEMPLATES.filter(t =>
    ['free','basic','pro','premium'].indexOf(t.minPlan) <= ['free','basic','pro','premium'].indexOf(plan)
  ).slice(0, 6)

  const steps = ['Twoja sytuacja', 'Wybierz szablon', 'Podstawowe dane']

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(5,12,28,0.92)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#0f1e38', border: '1px solid #1e3f75', borderRadius: 20,
        padding: '36px 40px', width: 520, maxWidth: '92vw',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < step ? '#4477ff' : i === step ? '#4477ff22' : '#1e3f75',
                color: i <= step ? '#e2eeff' : '#3a5070',
                border: i === step ? '2px solid #4477ff' : '2px solid transparent',
                transition: 'all 0.3s',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 32, height: 2, background: i < step ? '#4477ff' : '#1e3f75', borderRadius: 1, transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0 — Situation */}
        {step === 0 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#e2eeff', marginBottom: 8 }}>Twoja sytuacja</div>
              <div style={{ fontSize: 14, color: '#8ba3c4' }}>Wybierz co najlepiej opisuje Ciebie — dostosujemy CV pod Twoje potrzeby</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
              {SITUATION_CHIPS.map(c => (
                <button key={c.id} onClick={() => setSituation(s => s === c.label ? '' : c.label)}
                  style={{
                    padding: '9px 16px', borderRadius: 22, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: situation === c.label ? '#4477ff22' : '#122040',
                    border: `1px solid ${situation === c.label ? '#4477ff' : '#1e3f75'}`,
                    color: situation === c.label ? '#e2eeff' : '#8ba3c4',
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={skip} style={{ background: 'none', border: 'none', color: '#4a6080', fontSize: 13, cursor: 'pointer' }}>Pomiń</button>
              <button onClick={() => setStep(1)} style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Dalej →
              </button>
            </div>
          </>
        )}

        {/* Step 1 — Template */}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#e2eeff', marginBottom: 8 }}>Wybierz szablon</div>
              <div style={{ fontSize: 14, color: '#8ba3c4' }}>Możesz zmienić w dowolnym momencie</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
              {availableTemplates.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  style={{
                    padding: '14px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                    background: template === t.id ? '#4477ff22' : '#122040',
                    border: `2px solid ${template === t.id ? '#4477ff' : '#1e3f75'}`,
                    color: template === t.id ? '#e2eeff' : '#8ba3c4',
                  }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>
                    {t.id === 'classic' ? '📋' : t.id === 'modern' ? '⚡' : t.id === 'warsaw' ? '🏙️' : t.id === 'elegant' ? '✨' : t.id === 'bold' ? '💪' : t.id === 'academic' ? '🎓' : '📄'}
                  </div>
                  {t.label}
                  <div style={{ fontSize: 10, color: '#4a6080', marginTop: 3, fontWeight: 400 }}>{t.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(0)} style={{ background: 'none', border: '1px solid #1e3f75', color: '#8ba3c4', borderRadius: 10, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>← Wróć</button>
              <button onClick={() => setStep(2)} style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Dalej →
              </button>
            </div>
          </>
        )}

        {/* Step 2 — Basic info */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#e2eeff', marginBottom: 8 }}>Twoje dane</div>
              <div style={{ fontSize: 14, color: '#8ba3c4' }}>Zacznij od imienia i nazwiska</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Imię', value: firstName, set: setFirstName, placeholder: 'np. Jan' },
                { label: 'Nazwisko', value: lastName, set: setLastName, placeholder: 'np. Kowalski' },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: 11, color: '#4a6080', display: 'block', marginBottom: 6, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
                  <input
                    value={value}
                    onChange={e => set(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={e => { if (e.key === 'Enter') finish() }}
                    style={{
                      width: '100%', background: '#0d1c35', border: '1px solid #1e3f75',
                      borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#e2eeff',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#4477ff' }}
                    onBlur={e => { e.target.style.borderColor = '#1e3f75' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: '1px solid #1e3f75', color: '#8ba3c4', borderRadius: 10, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>← Wróć</button>
              <button onClick={finish} style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Zacznij tworzyć CV 🚀
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
