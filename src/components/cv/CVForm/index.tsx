'use client'

import { useState } from 'react'
import type { CVData, ExperienceItem, EducationItem } from '@/lib/cv/types'
import { SITUATION_CHIPS, LANGUAGE_LEVELS } from '@/lib/cv/types'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: '#0d1c35',
  border: '1px solid #1e3f75',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  color: '#e2eeff',
  outline: 'none',
  fontFamily: 'inherit',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#7a94bb',
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 5,
  display: 'block',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={INPUT_STYLE}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.5 }}
    />
  )
}

function SectionHeader({ title, open, onToggle, onAdd, addLabel }: { title: string; open: boolean; onToggle: () => void; onAdd?: () => void; addLabel?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: open ? 14 : 0 }}>
      <button
        onClick={onToggle}
        style={{ background: 'none', border: 'none', color: '#e2eeff', fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <span style={{ color: '#4477ff', fontSize: 10 }}>{open ? '▼' : '▶'}</span>
        {title}
      </button>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{ background: '#1e3f75', border: 'none', color: '#7a94bb', fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}
        >
          + {addLabel}
        </button>
      )}
    </div>
  )
}

interface Props {
  data: CVData
  onChange: (patch: Partial<CVData>) => void
  plan?: string
}

export default function CVForm({ data, onChange, plan = 'free' }: Props) {
  const [openSections, setOpenSections] = useState({ situation: true, personal: true, summary: false, experience: true, education: true, skills: false, languages: false, hobbies: false, certifications: false, jobad: false })
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])
  const [bulletSuggestLoading, setBulletSuggestLoading] = useState<Record<number, boolean>>({})
  const [suggestedBullets, setSuggestedBullets] = useState<Record<number, string[]>>({})

  function toggle(key: keyof typeof openSections) {
    setOpenSections(s => ({ ...s, [key]: !s[key] }))
  }

  function patchExp(i: number, patch: Partial<ExperienceItem>) {
    const exp = [...data.experience]
    exp[i] = { ...exp[i], ...patch }
    onChange({ experience: exp })
  }

  function patchEdu(i: number, patch: Partial<EducationItem>) {
    const edu = [...data.education]
    edu[i] = { ...edu[i], ...patch }
    onChange({ education: edu })
  }

  function addBullet(i: number) {
    patchExp(i, { bullets: [...(data.experience[i].bullets ?? []), ''] })
  }

  function patchBullet(expIdx: number, bulletIdx: number, val: string) {
    const bullets = [...(data.experience[expIdx].bullets ?? [])]
    bullets[bulletIdx] = val
    patchExp(expIdx, { bullets })
  }

  function removeBullet(expIdx: number, bulletIdx: number) {
    patchExp(expIdx, { bullets: (data.experience[expIdx].bullets ?? []).filter((_, i) => i !== bulletIdx) })
  }

  async function suggestSkills() {
    setSuggestLoading(true)
    setSuggestedSkills([])
    try {
      const res = await fetch('/api/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, experience: data.experience }),
      })
      if (res.ok) {
        const { skills } = await res.json()
        setSuggestedSkills(skills.filter((s: string) => !data.skills.includes(s)))
      }
    } finally {
      setSuggestLoading(false)
    }
  }

  function addSuggestedSkill(s: string) {
    onChange({ skills: [...data.skills, s] })
    setSuggestedSkills(prev => prev.filter(sk => sk !== s))
  }

  async function suggestBullets(i: number) {
    const e = data.experience[i]
    setBulletSuggestLoading(prev => ({ ...prev, [i]: true }))
    setSuggestedBullets(prev => ({ ...prev, [i]: [] }))
    try {
      const res = await fetch('/api/suggest-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: e.position, company: e.company, description: (e.bullets ?? []).filter(Boolean).join('. ') }),
      })
      if (res.ok) {
        const { bullets } = await res.json()
        setSuggestedBullets(prev => ({ ...prev, [i]: bullets }))
      }
    } finally {
      setBulletSuggestLoading(prev => ({ ...prev, [i]: false }))
    }
  }

  function addSuggestedBullet(expIdx: number, bullet: string) {
    patchExp(expIdx, { bullets: [...(data.experience[expIdx].bullets ?? []).filter(Boolean), bullet] })
    setSuggestedBullets(prev => ({ ...prev, [expIdx]: (prev[expIdx] || []).filter(b => b !== bullet) }))
  }

  const section = (key: keyof typeof openSections, title: string, content: React.ReactNode, onAdd?: () => void, addLabel?: string) => (
    <div style={{ borderBottom: '1px solid #162d50', padding: '12px 0' }}>
      <SectionHeader title={title} open={openSections[key]} onToggle={() => toggle(key)} onAdd={onAdd} addLabel={addLabel} />
      {openSections[key] && <div>{content}</div>}
    </div>
  )

  return (
    <div style={{ padding: '0 16px', overflowY: 'auto', height: '100%' }}>
      {/* Situation */}
      {section('situation', '1. Twoja sytuacja', (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SITUATION_CHIPS.map(c => (
            <button
              key={c.id}
              onClick={() => onChange({ situation: data.situation === c.id ? '' : c.id })}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: '1px solid',
                borderColor: data.situation === c.id ? '#4477ff' : '#1e3f75',
                background: data.situation === c.id ? '#4477ff22' : 'transparent',
                color: data.situation === c.id ? '#e2eeff' : '#7a94bb',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      ))}

      {/* Personal */}
      {section('personal', '2. Dane osobowe', (
        <div>
          {/* Photo upload */}
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            {data.photo
              ? <img src={data.photo} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4477ff44', flexShrink: 0 }} />
              : <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1e3f75', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a94bb', fontSize: 22, flexShrink: 0 }}>👤</div>
            }
            <div style={{ flex: 1 }}>
              <label style={{ ...LABEL_STYLE, display: 'block', marginBottom: 6 }}>Zdjęcie (opcjonalnie)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ background: '#1e3f75', border: '1px solid #2a5499', color: '#a0b8e8', fontSize: 12, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', userSelect: 'none' }}>
                  Wybierz zdjęcie
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const img = new Image()
                      const url = URL.createObjectURL(file)
                      img.onload = () => {
                        const MAX = 200
                        const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
                        const canvas = document.createElement('canvas')
                        canvas.width = Math.round(img.width * ratio)
                        canvas.height = Math.round(img.height * ratio)
                        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
                        onChange({ photo: canvas.toDataURL('image/jpeg', 0.82) })
                        URL.revokeObjectURL(url)
                      }
                      img.src = url
                    }}
                  />
                </label>
                {data.photo && (
                  <button onClick={() => onChange({ photo: '' })} style={{ background: 'none', border: '1px solid #5a1a1a', color: '#e55', fontSize: 12, padding: '5px 10px', borderRadius: 6, cursor: 'pointer' }}>
                    Usuń
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <Field label="Imię"><Input value={data.firstName} onChange={v => onChange({ firstName: v })} placeholder="Jan" /></Field>
            <Field label="Nazwisko"><Input value={data.lastName} onChange={v => onChange({ lastName: v })} placeholder="Kowalski" /></Field>
            <Field label="Stanowisko"><Input value={data.title} onChange={v => onChange({ title: v })} placeholder="Programista Frontend" /></Field>
            <Field label="Email"><Input value={data.email} onChange={v => onChange({ email: v })} placeholder="jan@email.pl" /></Field>
            <Field label="Telefon"><Input value={data.phone} onChange={v => onChange({ phone: v })} placeholder="+48 600 000 000" /></Field>
            <Field label="Miasto"><Input value={data.city} onChange={v => onChange({ city: v })} placeholder="Warszawa" /></Field>
            <Field label="Kraj"><Input value={data.country} onChange={v => onChange({ country: v })} placeholder="Polska" /></Field>
            <Field label="LinkedIn"><Input value={data.linkedin || ''} onChange={v => onChange({ linkedin: v })} placeholder="linkedin.com/in/jan" /></Field>
            <Field label="GitHub"><Input value={data.github || ''} onChange={v => onChange({ github: v })} placeholder="github.com/jan" /></Field>
            <Field label="Strona www"><Input value={data.website || ''} onChange={v => onChange({ website: v })} placeholder="jankowalski.pl" /></Field>
          </div>
        </div>
      ))}

      {/* Summary */}
      {section('summary', '3. Profil zawodowy', (
        <Field label="Podsumowanie (2–4 zdania)">
          <Textarea value={data.summary} onChange={v => onChange({ summary: v })} rows={4} placeholder="Doświadczony programista z 5-letnim stażem w branży fintech..." />
        </Field>
      ))}

      {/* Experience */}
      {section('experience', '4. Doświadczenie',
        <div>
          {data.experience.map((e, i) => (
            <div key={i} style={{ background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#7a94bb', fontWeight: 600 }}>Pozycja {i + 1}</span>
                <button onClick={() => onChange({ experience: data.experience.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: 12 }}>✕ Usuń</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <Field label="Stanowisko"><Input value={e.position} onChange={v => patchExp(i, { position: v })} placeholder="Senior Developer" /></Field>
                <Field label="Firma"><Input value={e.company} onChange={v => patchExp(i, { company: v })} placeholder="Tech Corp" /></Field>
                <Field label="Od (np. 2022-03)"><Input value={e.startDate} onChange={v => patchExp(i, { startDate: v })} placeholder="2022-03" /></Field>
                <Field label="Do (lub 'obecnie')"><Input value={e.endDate} onChange={v => patchExp(i, { endDate: v })} placeholder="obecnie" /></Field>
                <Field label="Miasto"><Input value={e.city || ''} onChange={v => patchExp(i, { city: v })} placeholder="Warszawa" /></Field>
              </div>
              <div style={{ marginTop: 8 }}>
                <label style={LABEL_STYLE}>Obowiązki i osiągnięcia</label>
                {(e.bullets ?? []).map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <input
                      value={b}
                      onChange={ev => patchBullet(i, j, ev.target.value)}
                      placeholder={`Punkt ${j + 1}...`}
                      style={{ ...INPUT_STYLE, flex: 1 }}
                    />
                    <button onClick={() => removeBullet(i, j)} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', padding: '0 4px' }}>✕</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <button onClick={() => addBullet(i)} style={{ background: 'none', border: '1px dashed #1e3f75', color: '#7a94bb', fontSize: 12, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', flex: 1 }}>
                    + Dodaj punkt
                  </button>
                  <button
                    onClick={() => suggestBullets(i)}
                    disabled={bulletSuggestLoading[i]}
                    style={{ background: '#4477ff11', border: '1px solid #4477ff44', color: '#7a9dff', fontSize: 12, padding: '5px 12px', borderRadius: 6, cursor: bulletSuggestLoading[i] ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {bulletSuggestLoading[i] ? '...' : '✨ Sugeruj'}
                  </button>
                </div>
                {(suggestedBullets[i] || []).length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {suggestedBullets[i].map((b, k) => (
                      <button
                        key={k}
                        onClick={() => addSuggestedBullet(i, b)}
                        style={{ background: '#4477ff0d', border: '1px solid #4477ff33', color: '#a0b8e8', fontSize: 12, padding: '6px 10px', borderRadius: 6, cursor: 'pointer', textAlign: 'left', lineHeight: 1.4 }}
                      >
                        + {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>,
        () => onChange({ experience: [...data.experience, { company: '', position: '', startDate: '', endDate: 'obecnie', city: '', bullets: [''] }] }),
        'Dodaj'
      )}

      {/* Education */}
      {section('education', '5. Wykształcenie',
        <div>
          {data.education.map((e, i) => (
            <div key={i} style={{ background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#7a94bb', fontWeight: 600 }}>Edukacja {i + 1}</span>
                <button onClick={() => onChange({ education: data.education.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: 12 }}>✕ Usuń</button>
              </div>
              <Field label="Uczelnia"><Input value={e.school} onChange={v => patchEdu(i, { school: v })} placeholder="Politechnika Warszawska" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <Field label="Stopień"><Input value={e.degree} onChange={v => patchEdu(i, { degree: v })} placeholder="Magister" /></Field>
                <Field label="Kierunek"><Input value={e.field} onChange={v => patchEdu(i, { field: v })} placeholder="Informatyka" /></Field>
                <Field label="Od"><Input value={e.startDate} onChange={v => patchEdu(i, { startDate: v })} placeholder="2018" /></Field>
                <Field label="Do"><Input value={e.endDate} onChange={v => patchEdu(i, { endDate: v })} placeholder="2023" /></Field>
                <Field label="Wynik / GPA (opcjonalnie)"><Input value={e.grade || ''} onChange={v => patchEdu(i, { grade: v })} placeholder="4.5 / 5.0" /></Field>
              </div>
            </div>
          ))}
        </div>,
        () => onChange({ education: [...data.education, { school: '', degree: '', field: '', startDate: '', endDate: '', grade: '' }] }),
        'Dodaj'
      )}

      {/* Skills */}
      {section('skills', '6. Umiejętności', (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {data.skills.map((s, i) => (
              <span key={i} style={{ background: '#162d50', color: '#c2d6f0', fontSize: 12, padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                {s}
                <button onClick={() => onChange({ skills: data.skills.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', padding: 0, fontSize: 11, lineHeight: 1 }}>✕</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              placeholder="Dodaj umiejętność..."
              style={INPUT_STYLE}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val && !data.skills.includes(val)) onChange({ skills: [...data.skills, val] });
                  (e.target as HTMLInputElement).value = ''
                  e.preventDefault()
                }
              }}
            />
          </div>
          <button
            onClick={suggestSkills}
            disabled={suggestLoading}
            style={{ marginTop: 10, background: 'none', border: '1px solid #4477ff', color: '#4477ff', fontSize: 12, padding: '6px 14px', borderRadius: 6, cursor: suggestLoading ? 'wait' : 'pointer', fontWeight: 600 }}
          >
            {suggestLoading ? 'Szukam...' : '✦ Podpowiedz umiejętności'}
          </button>
          {suggestedSkills.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: '#7a94bb', marginBottom: 6 }}>Kliknij, aby dodać:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestedSkills.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => addSuggestedSkill(s)}
                    style={{ background: '#162d50', color: '#c2d6f0', fontSize: 12, padding: '4px 10px', borderRadius: 20, border: '1px solid #2d5499', cursor: 'pointer' }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, color: '#4a6a99', marginTop: 6 }}>Naciśnij Enter lub przecinek, aby dodać</div>
        </div>
      ))}

      {/* Languages */}
      {section('languages', '7. Języki',
        <div>
          {data.languages.map((l, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <input value={l.name} onChange={e => { const ll = [...data.languages]; ll[i] = { ...ll[i], name: e.target.value }; onChange({ languages: ll }) }} placeholder="Polski" style={INPUT_STYLE} />
              <select value={l.level} onChange={e => { const ll = [...data.languages]; ll[i] = { ...ll[i], level: e.target.value }; onChange({ languages: ll }) }} style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
                {LANGUAGE_LEVELS.map(lv => <option key={lv} value={lv}>{lv}</option>)}
              </select>
              <button onClick={() => onChange({ languages: data.languages.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}>✕</button>
            </div>
          ))}
          <button onClick={() => onChange({ languages: [...data.languages, { name: '', level: 'B2 – Wyższy średniozaawansowany' }] })} style={{ background: 'none', border: '1px dashed #1e3f75', color: '#7a94bb', fontSize: 12, padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
            + Dodaj język
          </button>
        </div>
      )}

      {/* Hobbies */}
      {section('hobbies', '8. Zainteresowania (opcjonalnie)', (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {(data.hobbies || []).map((h, i) => (
              <span key={i} style={{ background: '#162d50', color: '#c2d6f0', fontSize: 12, padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                {h}
                <button onClick={() => onChange({ hobbies: (data.hobbies || []).filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', padding: 0, fontSize: 11 }}>✕</button>
              </span>
            ))}
          </div>
          <input
            placeholder="Dodaj zainteresowanie..."
            style={INPUT_STYLE}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') {
                const val = (e.target as HTMLInputElement).value.trim()
                if (val) onChange({ hobbies: [...(data.hobbies || []), val] });
                (e.target as HTMLInputElement).value = ''
                e.preventDefault()
              }
            }}
          />
        </div>
      ))}

      {/* Job Ad */}
      {section('jobad', '9. Ogłoszenie o pracę (opcjonalnie)', (
        <div>
          <div style={{ fontSize: 12, color: '#7a94bb', marginBottom: 8 }}>Wklej treść ogłoszenia, aby dostosować CV i list motywacyjny.</div>
          <Textarea value={data.jobAd || ''} onChange={v => onChange({ jobAd: v })} rows={6} placeholder="Wklej tu treść oferty pracy..." />
          {!['pro', 'premium'].includes(plan) && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#6B84AA', background: '#0d1c35', border: '1px solid rgba(56,100,200,0.18)', borderRadius: 8, padding: '8px 12px' }}>
              🔒 <a href="/cennik" style={{ color: '#4477ff', textDecoration: 'none' }}>Plan Pro</a> — Analiza ATS &nbsp;·&nbsp; <a href="/cennik" style={{ color: '#4477ff', textDecoration: 'none' }}>Plan Premium</a> — List motywacyjny
            </div>
          )}
        </div>
      ))}

      {/* Certifications */}
      {section('certifications', '10. Certyfikaty (opcjonalnie)',
        <div>
          {(data.certifications || []).map((c, i) => (
            <div key={i} style={{ background: '#0d1c35', border: '1px solid #1e3f75', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#7a94bb' }}>Certyfikat {i + 1}</span>
                <button onClick={() => onChange({ certifications: (data.certifications || []).filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: 12 }}>✕ Usuń</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <Field label="Nazwa"><input value={c.name} onChange={e => { const cc = [...(data.certifications || [])]; cc[i] = { ...cc[i], name: e.target.value }; onChange({ certifications: cc }) }} placeholder="AWS Solutions Architect" style={INPUT_STYLE} /></Field>
                <Field label="Wystawca"><input value={c.issuer} onChange={e => { const cc = [...(data.certifications || [])]; cc[i] = { ...cc[i], issuer: e.target.value }; onChange({ certifications: cc }) }} placeholder="Amazon" style={INPUT_STYLE} /></Field>
                <Field label="Data"><input value={c.date} onChange={e => { const cc = [...(data.certifications || [])]; cc[i] = { ...cc[i], date: e.target.value }; onChange({ certifications: cc }) }} placeholder="2024-06" style={INPUT_STYLE} /></Field>
              </div>
            </div>
          ))}
        </div>,
        () => onChange({ certifications: [...(data.certifications || []), { name: '', issuer: '', date: '' }] }),
        'Dodaj'
      )}

      <div style={{ height: 40 }} />
    </div>
  )
}
