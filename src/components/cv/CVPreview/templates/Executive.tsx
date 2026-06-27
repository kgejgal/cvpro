import type { CVData } from '@/lib/cv/types'

export default function ExecutiveTemplate({ data }: { data: CVData }) {
  const L = data.language === 'en'
    ? { exp: 'Executive Experience', edu: 'Education', skills: 'Leadership Competencies', langs: 'Languages', summary: 'Executive Summary', present: 'Present', certs: 'Credentials' }
    : { exp: 'Doświadczenie kierownicze', edu: 'Wykształcenie', skills: 'Kompetencje przywódcze', langs: 'Języki', summary: 'Podsumowanie dyrektorskie', present: 'Obecnie', certs: 'Kwalifikacje' }

  const darkSlate = '#1e2d42'
  const gold = '#b8972f'
  const initials = `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-playfair), Playfair Display, serif', fontSize: 13, color: '#222' }}>
      {/* Prestige header */}
      <div style={{ background: darkSlate, padding: '40px 48px', display: 'flex', gap: 28, alignItems: 'center' }}>
        {data.photo
          ? <img src={data.photo} alt="" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}`, flexShrink: 0 }} />
          : <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'transparent', border: `2px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 400, color: gold, flexShrink: 0, fontFamily: 'var(--font-playfair), serif' }}>{initials}</div>
        }
        <div style={{ flex: 1 }}>
          <div style={{ height: 1, background: `${gold}60`, marginBottom: 12 }} />
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: 0.5, lineHeight: 1.1 }}>{data.firstName} {data.lastName}</div>
          {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: gold, marginTop: 8, fontStyle: 'italic', fontWeight: 400 }}>{data.title}</div>}
          <div style={{ height: 1, background: `${gold}60`, marginTop: 12, marginBottom: 10 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 22px', fontSize: 11, color: '#9bb5cc', fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.city && <span>{data.city}{data.country ? `, ${data.country}` : ''}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 48px' }}>
        {data.summary && (
          <div style={{ marginBottom: 24, padding: '16px 20px', borderLeft: `3px solid ${gold}`, background: '#faf9f5' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, fontFamily: 'var(--font-lato), Lato, sans-serif', marginBottom: 8 }}>{L.summary}</div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#333', lineHeight: 1.75, fontStyle: 'italic' }}>{data.summary}</div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: darkSlate, fontFamily: 'var(--font-lato), Lato, sans-serif', borderBottom: `2px solid ${gold}`, paddingBottom: 6, marginBottom: 16 }}>{L.exp}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 15, color: darkSlate }}>{e.position}</div>
                  <div style={{ fontSize: 11, color: '#888', fontFamily: 'var(--font-lato), Lato, sans-serif' }}>{e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}</div>
                </div>
                <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: gold, fontStyle: 'italic', marginBottom: 8, fontFamily: 'var(--font-lato), Lato, sans-serif' }}>{e.company}{e.city ? ` · ${e.city}` : ''}</div>
                {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                  <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#444', paddingLeft: 16, marginBottom: 5, lineHeight: 1.65, position: 'relative', fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
                    <span style={{ position: 'absolute', left: 0, color: gold }}>◆</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div>
            {data.education.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: darkSlate, fontFamily: 'var(--font-lato), Lato, sans-serif', borderBottom: `2px solid ${gold}`, paddingBottom: 6, marginBottom: 12 }}>{L.edu}</div>
                {data.education.map((e, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: gold, fontStyle: 'italic', fontFamily: 'var(--font-lato), Lato, sans-serif' }}>{e.school}</div>
                    <div style={{ fontSize: 11, color: '#888', fontFamily: 'var(--font-lato), Lato, sans-serif' }}>{e.startDate} – {e.endDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {data.skills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: darkSlate, fontFamily: 'var(--font-lato), Lato, sans-serif', borderBottom: `2px solid ${gold}`, paddingBottom: 6, marginBottom: 12 }}>{L.skills}</div>
                {data.skills.map((s, i) => (
                  <div key={i} style={{ fontSize: 12, marginBottom: 5, display: 'flex', gap: 8, fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
                    <span style={{ color: gold, fontSize: 8, paddingTop: 4 }}>◆</span>{s}
                  </div>
                ))}
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: darkSlate, fontFamily: 'var(--font-lato), Lato, sans-serif', borderBottom: `2px solid ${gold}`, paddingBottom: 6, marginBottom: 12 }}>{L.langs}</div>
                {data.languages.map((l, i) => (
                  <div key={i} style={{ marginBottom: 8, fontFamily: 'var(--font-lato), Lato, sans-serif', fontSize: 12 }}>
                    <span style={{ fontWeight: 700 }}>{l.name}</span> — <span style={{ color: '#666' }}>{l.level}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
