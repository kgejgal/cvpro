import type { CVData } from '@/lib/cv/types'

export default function LuxuryTemplate({ data }: { data: CVData }) {
  const gold = '#C9A86A'
  const navy = '#15273B'

  const L = data.language === 'en'
    ? { exp: 'Professional Experience', edu: 'Education', skills: 'Core Competencies', langs: 'Languages', summary: 'Executive Profile', present: 'present', certs: 'Certifications' }
    : { exp: 'Doświadczenie zawodowe', edu: 'Wykształcenie', skills: 'Kluczowe kompetencje', langs: 'Języki', summary: 'Profil zawodowy', present: 'obecnie', certs: 'Certyfikaty' }

  const initials = `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-lato), Lato, sans-serif', fontSize: 13, color: '#2c2c2c' }}>
      {/* Navy hero band */}
      <div style={{ background: navy, padding: '36px 44px', display: 'flex', gap: 28, alignItems: 'center' }}>
        {data.photo
          ? <img src={data.photo} alt="" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${gold}`, flexShrink: 0 }} />
          : <div style={{ width: 84, height: 84, borderRadius: '50%', background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: navy, flexShrink: 0 }}>{initials}</div>
        }
        <div style={{ flex: 1 }}>
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: 1, fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
            {data.firstName} {data.lastName}
          </div>
          {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: gold, marginTop: 6, letterSpacing: 0.5 }}>{data.title}</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: 12, fontSize: 11, color: '#a0b4cc' }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>📞 {data.phone}</span>}
            {(data.city || data.country) && <span>📍 {[data.city, data.country].filter(Boolean).join(', ')}</span>}
            {data.linkedin && <span>in {data.linkedin}</span>}
          </div>
        </div>
      </div>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${gold}, #e8c98a, ${gold})` }} />

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 900 }}>
        {/* Left */}
        <div style={{ background: '#f5f0e8', padding: '24px 18px', borderRight: `2px solid ${gold}40` }}>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, marginBottom: 12 }}>{L.skills}</div>
              {data.skills.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: '#3d3d3d', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: gold, fontSize: 8 }}>◆</span>{s}
                </div>
              ))}
            </div>
          )}
          {data.languages.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, marginBottom: 12 }}>{L.langs}</div>
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: '#2c2c2c' }}>{l.name}</div>
                  <div style={{ color: '#777', fontSize: 11 }}>{l.level}</div>
                </div>
              ))}
            </div>
          )}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, marginBottom: 12 }}>{L.certs}</div>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 11 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#777' }}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ padding: '24px 28px' }}>
          {data.summary && (
            <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${gold}60` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, marginBottom: 10 }}>{L.summary}</div>
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#444', lineHeight: 1.7, fontStyle: 'italic' }}>{data.summary}</div>
            </div>
          )}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, marginBottom: 14 }}>{L.exp}</div>
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `2px solid ${gold}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</div>
                    <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}</div>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: gold, marginBottom: 6 }}>{e.company}{e.city ? ` · ${e.city}` : ''}</div>
                  {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#444', paddingLeft: 12, marginBottom: 4, lineHeight: 1.6, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: gold }}>›</span>{b}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: gold, marginBottom: 12 }}>{L.edu}</div>
              {data.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: gold }}>{e.school}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>{e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
