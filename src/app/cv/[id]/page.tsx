'use client'

import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CVData } from '@/lib/cv/types'
import { EMPTY_CV } from '@/lib/cv/types'
import ScaledCV from '@/components/cv/ScaledCV'
import Link from 'next/link'

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

export default function PublicCVPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const docRef = useRef<HTMLDivElement>(null)

  // Shared CVs are read-only: the templates mark their text blocks contentEditable (that is how
  // the owner's live preview works), which a visitor must not be able to type into.
  useEffect(() => {
    const root = docRef.current
    if (!root) return
    const lock = () => root.querySelectorAll('[contenteditable]').forEach(el => el.setAttribute('contenteditable', 'false'))
    lock()
    const observer = new MutationObserver(lock) // templates are lazy-loaded, so they mount after this runs
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [data])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('cvs')
      .select('data, template, is_public')
      .eq('id', id)
      .eq('is_public', true)
      .single()
      .then(({ data: cv }) => {
        if (!cv) { setNotFound(true); setLoading(false); return }
        setData({ ...EMPTY_CV, ...(cv.data as CVData) })
        setLoading(false)
        // Track view — fire and forget (a blocked or offline request must not surface as an unhandled error)
        fetch('/api/cv/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cv_id: id }) }).catch(() => {})
      })
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1c35', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#7a94bb', fontSize: 14 }}>Ładowanie CV...</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1c35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ color: '#e2eeff', fontSize: 18, fontWeight: 700 }}>CV nie jest dostępne</div>
        <div style={{ color: '#7a94bb', fontSize: 14 }}>To CV jest prywatne lub nie istnieje.</div>
        <Link href="/" style={{ color: '#4477ff', textDecoration: 'none', fontSize: 14 }}>← Wróć do strony głównej</Link>
      </div>
    )
  }

  const Template = TEMPLATE_MAP[data!.template] ?? TEMPLATE_MAP.classic

  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35' }}>
      <div style={{ background: '#122040', borderBottom: '1px solid #1e3f75', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 17, color: '#e2eeff', textDecoration: 'none' }}>
          <span style={{ color: '#4477ff' }}>CV</span>Pro<span style={{ color: '#4477ff', fontSize: 12 }}>.pl</span>
        </Link>
        <Link href="/auth/signup" style={{ background: '#4477ff', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 8 }}>
          Stwórz własne CV →
        </Link>
      </div>

      <style>{'.cv-readonly [contenteditable]{outline:none!important;cursor:default!important;background:transparent!important}'}</style>
      {/* ScaledCV shrinks the fixed 794px A4 page to fit phones; without it the right half was cut off and unreachable. */}
      <div style={{ padding: '32px 16px' }}>
        <ScaledCV maxScale={1}>
          <div ref={docRef} className="cv-readonly" style={{ width: 794, boxShadow: '0 4px 40px rgba(0,0,0,0.5)', borderRadius: 4, overflow: 'hidden' }}>
            <Suspense fallback={<div style={{ width: 794, minHeight: 600, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Ładowanie…</div>}>
              <Template data={data!} />
            </Suspense>
          </div>
        </ScaledCV>
      </div>
    </div>
  )
}
