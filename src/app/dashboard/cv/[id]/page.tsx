'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CVData } from '@/lib/cv/types'
import { EMPTY_CV, planAllows } from '@/lib/cv/types'
import CVForm from '@/components/cv/CVForm'
import CVPreview from '@/components/cv/CVPreview'
import NotificationBell from '@/components/NotificationBell'
import OnboardingWizard from '@/components/OnboardingWizard'
import { lazy, Suspense } from 'react'

const TEMPLATE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<{ data: CVData }>>> = {
  classic:      lazy(() => import('@/components/cv/CVPreview/templates/Classic')),
  modern:       lazy(() => import('@/components/cv/CVPreview/templates/Modern')),
  warsaw:       lazy(() => import('@/components/cv/CVPreview/templates/Warsaw')),
  elegant:      lazy(() => import('@/components/cv/CVPreview/templates/Elegant')),
  bold:         lazy(() => import('@/components/cv/CVPreview/templates/Bold')),
  academic:     lazy(() => import('@/components/cv/CVPreview/templates/Academic')),
  luxury:       lazy(() => import('@/components/cv/CVPreview/templates/Luxury')),
  minimal:      lazy(() => import('@/components/cv/CVPreview/templates/Minimal')),
  professional: lazy(() => import('@/components/cv/CVPreview/templates/Professional')),
  creative:     lazy(() => import('@/components/cv/CVPreview/templates/Creative')),
  startup:      lazy(() => import('@/components/cv/CVPreview/templates/Startup')),
  timeline:     lazy(() => import('@/components/cv/CVPreview/templates/Timeline')),
  technical:    lazy(() => import('@/components/cv/CVPreview/templates/Technical')),
  compact:      lazy(() => import('@/components/cv/CVPreview/templates/Compact')),
  executive:    lazy(() => import('@/components/cv/CVPreview/templates/Executive')),
  nordic:       lazy(() => import('@/components/cv/CVPreview/templates/Nordic')),
}

type ATSResult = {
  score: number; grade: string; summary: string; strengths: string[]
  improvements: { priority: string; tip: string }[]
  keywords: { found: string[]; missing: string[] }
}

export default function CVEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<CVData>({ ...EMPTY_CV })
  const [plan, setPlan] = useState('free')
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const [cvId, setCvId] = useState<string | null>(id === 'new' ? null : id)
  const [titleInput, setTitleInput] = useState('Moje CV')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveModalName, setSaveModalName] = useState('')

  // ATS
  const [showATS, setShowATS] = useState(false)
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null)
  const [atsLoading, setAtsLoading] = useState(false)

  // Cover letter
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [coverLoading, setCoverLoading] = useState(false)
  const [coverTone, setCoverTone] = useState<'professional' | 'formal' | 'creative'>('professional')

  // Error + share
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      setPlan(profile?.plan || 'free')
      if (id !== 'new') {
        const { data: cv } = await supabase.from('cvs').select('*').eq('id', id).eq('user_id', user.id).single()
        if (cv) {
          setData({ ...EMPTY_CV, ...(cv.data as CVData) })
          setTitleInput(cv.title || 'Moje CV')
          setCvId(cv.id)
          setIsPublic(cv.is_public ?? false)
        }
      }
    })
  }, [id, router])

  const save = useCallback(async (cvData: CVData, title: string) => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (cvId) {
      await supabase.from('cvs').update({ data: cvData as never, title, template: cvData.template, color: cvData.colorTheme, updated_at: new Date().toISOString() }).eq('id', cvId)
    } else {
      const { data: newCv } = await supabase.from('cvs').insert({ user_id: user.id, data: cvData as never, title, template: cvData.template, color: cvData.colorTheme, is_public: false }).select().single()
      if (newCv) { setCvId(newCv.id); window.history.replaceState(null, '', `/dashboard/cv/${newCv.id}`) }
    }
    setSaving(false)
    setSaved(true)
  }, [cvId])

  function handleChange(patch: Partial<CVData>) {
    const next = { ...data, ...patch }
    setData(next)
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(next, titleInput), 1500)
  }

  function handleDownloadPDF() {
    if (plan === 'free') {
      document.body.classList.add('cv-free-print')
      window.print()
      setTimeout(() => document.body.classList.remove('cv-free-print'), 2000)
      return
    }
    window.print()
  }

  async function runATS() {
    if (!planAllows(plan, 'pro')) { router.push('/cennik'); return }
    setAtsLoading(true); setErrorMsg(null)
    try {
      const res = await fetch('/api/ats-analysis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cv: data, jobAd: data.jobAd }) })
      if (res.ok) { setAtsResult(await res.json()) }
      else { const e = await res.json().catch(() => ({})); setErrorMsg(e.error || 'Błąd analizy ATS.') }
    } catch { setErrorMsg('Błąd połączenia.') }
    finally { setAtsLoading(false) }
  }

  async function generateCoverLetter() {
    if (!planAllows(plan, 'premium')) { router.push('/cennik'); return }
    setCoverLoading(true); setErrorMsg(null)
    try {
      const res = await fetch('/api/cover-letter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cv: data, jobAd: data.jobAd, tone: coverTone }) })
      if (res.ok) { const { letter } = await res.json(); setCoverLetter(letter) }
      else { const e = await res.json().catch(() => ({})); setErrorMsg(e.error || 'Błąd generowania listu.') }
    } catch { setErrorMsg('Błąd połączenia.') }
    finally { setCoverLoading(false) }
  }

  async function toggleShare() {
    if (!cvId) return
    const next = !isPublic; setIsPublic(next)
    const supabase = createClient()
    await supabase.from('cvs').update({ is_public: next }).eq('id', cvId)
    if (next) {
      await navigator.clipboard.writeText(`${window.location.origin}/cv/${cvId}`).catch(() => {})
      setShareCopied(true); setTimeout(() => setShareCopied(false), 3000)
    }
  }

  function printCoverLetter() {
    const win = window.open('', '_blank'); if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Georgia,serif;max-width:700px;margin:60px auto;font-size:14px;line-height:1.75;color:#222}p{margin-bottom:1.2em}@media print{body{margin:40px}}</style></head><body>`)
    coverLetter.split('\n\n').forEach(p => { if (p.trim()) win.document.write(`<p>${p.replace(/\n/g, '<br>')}</p>`) })
    win.document.write('</body></html>'); win.document.close(); win.print()
  }

  const gradeColor = (g: string) => g?.startsWith('A') ? '#3db36a' : g?.startsWith('B') ? '#f0a500' : '#e55'

  const TemplateComponent = TEMPLATE_MAP[data.template] ?? TEMPLATE_MAP.classic

  const atsPanelRef = useRef<HTMLDivElement>(null)
  const coverPanelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  function openATS() {
    setShowATS(s => { if (!s) setTimeout(() => atsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); return !s })
  }
  function openCoverLetter() {
    setShowCoverLetter(s => { if (!s) setTimeout(() => coverPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); return !s })
  }

  // ─── PREVIEW MODE ────────────────────────────────────────────────────────────
  if (mode === 'preview') {
    return (
      <>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d1c35', color: '#e2eeff' }}>

        {/* Preview top bar */}
        <div className="no-print" style={{ background: '#122040', borderBottom: '1px solid #1e3f75', height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0 }}>
          <button onClick={() => setMode('edit')} style={{ background: 'none', border: 'none', color: '#7a94bb', fontSize: 13, cursor: 'pointer' }}>
            ← Edytuj
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2eeff' }}>
              {saved ? '✓ Twoje CV jest gotowe!' : saving ? 'Zapisywanie...' : '● Niezapisane'}
            </div>
            <div style={{ fontSize: 11, color: '#4a6a99', marginTop: 1 }}>Kliknij profil lub punkty, aby edytować</div>
          </div>
          <button onClick={handleDownloadPDF} style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(68,119,255,0.4)' }}>
            ↓ PDF
          </button>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="no-print" style={{ background: '#2d1212', borderBottom: '1px solid #5a1a1a', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: '#e55', flex: 1 }}>⚠ {errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        )}

        {/* Scrollable area: CV + panels below */}
        <div ref={scrollRef} className="cv-print-outer" style={{ flex: 1, overflow: 'auto', background: '#0d1c35', padding: '32px 16px 140px' }}>

          {/* CV centered */}
          <div className="cv-scale-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center', display: 'inline-block' }}>
              <div style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.6)', borderRadius: 3 }}>
                <Suspense fallback={<div style={{ width: 794, minHeight: 1123, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 14 }}>Ładowanie…</div>}>
                  <TemplateComponent data={data} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* ATS panel — below CV */}
          {showATS && (
            <div ref={atsPanelRef} className="no-print" style={{ maxWidth: 794, margin: '32px auto 0', background: '#122040', border: '1px solid #1e3f75', borderRadius: 14, overflow: 'hidden' }}>
              {/* ATS header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e3f75', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>📊</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#e2eeff' }}>Analiza ATS</div>
                {atsResult && (
                  <>
                    <div style={{ background: gradeColor(atsResult.grade) + '20', color: gradeColor(atsResult.grade), border: `1px solid ${gradeColor(atsResult.grade)}50`, padding: '3px 14px', borderRadius: 20, fontSize: 14, fontWeight: 800 }}>
                      {atsResult.grade}
                    </div>
                    {/* Score bar */}
                    <div style={{ flex: 1, maxWidth: 180, height: 8, background: '#0d1c35', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${atsResult.score}%`, background: `linear-gradient(90deg, ${gradeColor(atsResult.grade)}, ${gradeColor(atsResult.grade)}99)`, borderRadius: 4, transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: gradeColor(atsResult.grade) }}>{atsResult.score}/100</div>
                  </>
                )}
                <button onClick={runATS} disabled={atsLoading} style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#4477FF,#2255dd)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 12, cursor: atsLoading ? 'wait' : 'pointer', fontWeight: 600, opacity: atsLoading ? 0.7 : 1 }}>
                  {atsLoading ? '⏳ Analizuję...' : atsResult ? '↺ Odśwież' : 'Analizuj CV'}
                </button>
                <button onClick={() => setShowATS(false)} style={{ background: 'none', border: 'none', color: '#4a6a99', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
              </div>

              {atsLoading && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#4a6a99', fontSize: 13 }}>
                  Analizuję CV pod kątem systemów ATS...
                </div>
              )}

              {atsResult && !atsLoading && (
                <div style={{ padding: '0' }}>
                  {atsResult.summary && (
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3f75', fontSize: 13, color: '#7a94bb', lineHeight: 1.6 }}>
                      {atsResult.summary}
                    </div>
                  )}

                  {/* Three-column table */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                    {/* Column 1: Strengths */}
                    <div style={{ borderRight: '1px solid #1e3f75', padding: '16px 18px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#3db36a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>✅</span> Co jest OK
                      </div>
                      {atsResult.strengths.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {atsResult.strengths.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: '#0d2a1a', borderRadius: 8, border: '1px solid #1a4a2a' }}>
                              <span style={{ color: '#3db36a', fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                              <span style={{ fontSize: 12, color: '#6ed49a', lineHeight: 1.4 }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: '#3a5070', fontStyle: 'italic' }}>Brak mocnych stron do wyświetlenia</div>
                      )}
                    </div>

                    {/* Column 2: High-priority fixes */}
                    <div style={{ borderRight: '1px solid #1e3f75', padding: '16px 18px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#e55', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>❌</span> Co poprawić
                      </div>
                      {atsResult.improvements.filter(t => t.priority === 'high').length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {atsResult.improvements.filter(t => t.priority === 'high').map((tip, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: '#2a0d0d', borderRadius: 8, border: '1px solid #4a1a1a' }}>
                              <span style={{ color: '#e55', fontSize: 13, flexShrink: 0, marginTop: 1 }}>✕</span>
                              <span style={{ fontSize: 12, color: '#ff9090', lineHeight: 1.4 }}>{tip.tip}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: '#3db36a', fontStyle: 'italic' }}>Brak krytycznych błędów 🎉</div>
                      )}
                    </div>

                    {/* Column 3: To add (medium/low + missing keywords) */}
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#f0a500', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>💡</span> Co dodać
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {atsResult.improvements.filter(t => t.priority !== 'high').map((tip, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: '#1e1500', borderRadius: 8, border: '1px solid #3a2800' }}>
                            <span style={{ color: '#f0a500', fontSize: 13, flexShrink: 0, marginTop: 1 }}>+</span>
                            <span style={{ fontSize: 12, color: '#ffcc66', lineHeight: 1.4 }}>{tip.tip}</span>
                          </div>
                        ))}
                        {atsResult.keywords.missing.length > 0 && atsResult.keywords.missing.map((k, i) => (
                          <div key={`kw-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#0d1c35', borderRadius: 8, border: '1px solid #1e3f75' }}>
                            <span style={{ color: '#4477ff', fontSize: 12, flexShrink: 0 }}>🔑</span>
                            <span style={{ fontSize: 12, color: '#7ab0ff', lineHeight: 1.4 }}>{k}</span>
                          </div>
                        ))}
                        {atsResult.improvements.filter(t => t.priority !== 'high').length === 0 && atsResult.keywords.missing.length === 0 && (
                          <div style={{ fontSize: 12, color: '#3a5070', fontStyle: 'italic' }}>Świetnie! Nic do dodania.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!atsResult && !atsLoading && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#3a5070', fontSize: 13 }}>
                  Kliknij <strong style={{ color: '#4477ff' }}>Analizuj CV</strong>, aby sprawdzić zgodność z systemami ATS i dostać konkretne wskazówki.
                </div>
              )}
            </div>
          )}

          {/* Cover letter panel — below CV */}
          {showCoverLetter && (
            <div ref={coverPanelRef} className="no-print" style={{ maxWidth: 794, margin: '32px auto 0', background: '#122040', border: '1px solid #1e3f75', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>📝 List motywacyjny</div>
                <select value={coverTone} onChange={e => setCoverTone(e.target.value as typeof coverTone)} style={{ background: '#0d1c35', color: '#7a94bb', border: '1px solid #1e3f75', borderRadius: 6, padding: '4px 10px', fontSize: 12 }}>
                  <option value="professional">Profesjonalny</option>
                  <option value="formal">Formalny</option>
                  <option value="creative">Kreatywny</option>
                </select>
                <button onClick={generateCoverLetter} disabled={coverLoading} style={{ background: '#4477ff', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 12, cursor: coverLoading ? 'wait' : 'pointer', fontWeight: 600 }}>
                  {coverLoading ? 'Generuję...' : coverLetter ? 'Przepisz' : 'Generuj list'}
                </button>
                {coverLetter && (
                  <button onClick={printCoverLetter} style={{ background: '#1e3f75', color: '#e2eeff', border: '1px solid #2d5499', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    ↓ Drukuj list
                  </button>
                )}
                <button onClick={() => setShowCoverLetter(false)} style={{ background: 'none', border: 'none', color: '#4a6a99', cursor: 'pointer', fontSize: 20, lineHeight: 1, marginLeft: 'auto' }}>✕</button>
              </div>
              {coverLetter ? (
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} style={{ width: '100%', minHeight: 280, background: '#0d1c35', color: '#e2eeff', border: '1px solid #1e3f75', borderRadius: 8, padding: '12px 16px', fontSize: 14, lineHeight: 1.75, resize: 'vertical', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
              ) : (
                <div style={{ color: '#3a5070', fontSize: 13, paddingTop: 4 }}>
                  Kliknij &quot;Generuj list&quot;, aby stworzyć spersonalizowany list motywacyjny.{data.jobAd && ' Ogłoszenie zostanie uwzględnione.'}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom action bar */}
        <div className="no-print" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0f1e38', borderTop: '1px solid #1e3f75', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', zIndex: 50 }}>
          <button
            onClick={handleDownloadPDF}
            style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 14px rgba(68,119,255,0.4)' }}
          >
            🖨 Pobierz PDF
          </button>

          {planAllows(plan, 'pro') ? (
            <button
              onClick={openATS}
              style={{ background: showATS ? '#4477ff22' : '#162d50', border: `1px solid ${showATS ? '#4477ff' : '#1e3f75'}`, color: showATS ? '#4477ff' : '#a0b8e8', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              📊 Analiza ATS {atsResult ? `· ${atsResult.score}%` : ''}
            </button>
          ) : (
            <button onClick={() => router.push('/cennik')} style={{ background: '#162d50', border: '1px solid #1e3f75', color: '#3a5070', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
              🔒 Analiza ATS
            </button>
          )}

          {planAllows(plan, 'premium') ? (
            <button
              onClick={openCoverLetter}
              style={{ background: showCoverLetter ? '#4477ff22' : '#162d50', border: `1px solid ${showCoverLetter ? '#4477ff' : '#1e3f75'}`, color: showCoverLetter ? '#4477ff' : '#a0b8e8', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              📝 List motywacyjny
            </button>
          ) : (
            <button onClick={() => router.push('/cennik')} style={{ background: '#162d50', border: '1px solid #1e3f75', color: '#3a5070', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
              🔒 List motywacyjny
            </button>
          )}

          {cvId && (
            <button
              onClick={toggleShare}
              style={{ background: isPublic ? '#1a3d2e' : '#162d50', border: `1px solid ${isPublic ? '#2a5a40' : '#1e3f75'}`, color: isPublic ? '#3db36a' : '#a0b8e8', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              🔗 {shareCopied ? 'Skopiowano!' : isPublic ? 'Publiczne' : 'Udostępnij link'}
            </button>
          )}

          <button
            onClick={() => { setSaveModalName(titleInput); setShowSaveModal(true) }}
            style={{ background: saved ? '#0d2a1a' : '#162d50', border: `1px solid ${saved ? '#2a5a40' : '#1e3f75'}`, color: saved ? '#3db36a' : '#a0b8e8', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {saving ? '⏳' : saved ? '✓' : '💾'} {saving ? 'Zapisuję...' : 'Zapisz CV'}
          </button>

          <button
            onClick={() => setMode('edit')}
            style={{ background: '#162d50', border: '1px solid #1e3f75', color: '#7a94bb', borderRadius: 8, padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}
          >
            ← Wstecz
          </button>
        </div>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,12,28,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowSaveModal(false) }}
        >
          <div style={{ background: '#122040', border: '1px solid #1e3f75', borderRadius: 16, padding: '32px 36px', width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>💾</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#e2eeff', marginBottom: 6 }}>Zapisz CV</div>
            <div style={{ fontSize: 13, color: '#4a6a99', marginBottom: 24, lineHeight: 1.5 }}>
              Wszystkie Twoje dane, doświadczenie i zdjęcie zostaną zapisane. Możesz wrócić do edycji w dowolnym momencie.
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: '#7a94bb', display: 'block', marginBottom: 8 }}>
              Nazwa CV
            </label>
            <input
              autoFocus
              value={saveModalName}
              onChange={e => setSaveModalName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && saveModalName.trim()) {
                  setTitleInput(saveModalName.trim())
                  save(data, saveModalName.trim())
                  setShowSaveModal(false)
                }
                if (e.key === 'Escape') setShowSaveModal(false)
              }}
              placeholder="np. CV — Backend Developer"
              style={{ width: '100%', background: '#0d1c35', border: '1px solid #2d5499', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#e2eeff', outline: 'none', boxSizing: 'border-box', marginBottom: 24 }}
              onFocus={e => { e.target.style.borderColor = '#4477ff' }}
              onBlur={e => { e.target.style.borderColor = '#2d5499' }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{ flex: 1, background: 'none', border: '1px solid #1e3f75', color: '#7a94bb', borderRadius: 10, padding: '12px', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  const name = saveModalName.trim() || titleInput
                  setTitleInput(name)
                  save(data, name)
                  setShowSaveModal(false)
                }}
                disabled={!saveModalName.trim()}
                style={{ flex: 2, background: saveModalName.trim() ? 'linear-gradient(135deg,#4477FF,#7C3AED)' : '#162d50', color: saveModalName.trim() ? '#fff' : '#3a5070', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, cursor: saveModalName.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, boxShadow: saveModalName.trim() ? '0 4px 16px rgba(68,119,255,0.4)' : 'none', transition: 'all 0.2s' }}
              >
                ✓ Zapisz CV
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    )
  }

  // ─── EDIT MODE ───────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d1c35', color: '#e2eeff' }}>

      {id === 'new' && (
        <OnboardingWizard plan={plan} onComplete={patch => setData(d => ({ ...d, ...patch }))} />
      )}

      {/* Edit top bar */}
      <div className="no-print" style={{ background: '#122040', borderBottom: '1px solid #1e3f75', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <Link href="/dashboard" style={{ color: '#7a94bb', textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap' }}>← Dashboard</Link>
        <div style={{ width: 1, height: 20, background: '#1e3f75', flexShrink: 0 }} />
        <input
          value={titleInput}
          onChange={e => { setTitleInput(e.target.value); setSaved(false); clearTimeout(saveTimer.current); saveTimer.current = setTimeout(() => save(data, e.target.value), 1500) }}
          style={{ background: 'none', border: 'none', color: '#e2eeff', fontSize: 14, fontWeight: 600, outline: 'none', flex: 1, minWidth: 0 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {userId && <NotificationBell userId={userId} />}
          <span style={{ fontSize: 12, color: saving ? '#7a94bb' : saved ? '#3db36a' : '#f0a500' }}>
            {saving ? 'Zapisywanie...' : saved ? '✓ Zapisano' : '● Niezapisane'}
          </span>
          <button
            onClick={() => { save(data, titleInput); setMode('preview') }}
            style={{ background: 'linear-gradient(135deg,#4477FF,#7C3AED)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(68,119,255,0.4)', whiteSpace: 'nowrap' }}
          >
            Gotowe →
          </button>
        </div>
      </div>

      {/* Main editor split */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', overflow: 'hidden' }}>
        {/* Form panel */}
        <div className="no-print" style={{ borderRight: '1px solid #1e3f75', overflowY: 'auto', background: '#162d50' }}>
          <CVForm data={data} onChange={handleChange} plan={plan} />
        </div>

        {/* Preview panel (has template picker + colors) */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <CVPreview data={data} plan={plan} onChange={handleChange} onDownloadPDF={handleDownloadPDF} />
        </div>
      </div>
    </div>
  )
}
