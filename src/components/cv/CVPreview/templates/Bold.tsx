import type { CVData } from '@/lib/cv/types'

export default function BoldTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'

  const labels = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Summary', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'Profil', present: 'obecnie' }

  return (
    <div
      id="cv-doc"
      style={{
        width: 794,
        minHeight: 1123,
        background: '#fff',
        fontFamily: 'var(--font-onest), Onest, sans-serif',
        fontSize: 13,
        color: '#1a1a1a',
        '--cv-accent': accent,
      } as React.CSSProperties}
    >
      {/* Dark header */}
      <div style={{ background: '#0d1c35', padding: '36px 40px', color: '#fff' }}>
        <div contentEditable suppressContentEditableWarning style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>
          {data.firstName}<br />{data.lastName}
        </div>
        {data.title && (
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: accent, fontWeight: 600, marginTop: 8 }}>
            {data.title}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: 16, fontSize: 11, color: '#a0b4cc' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {(data.city || data.country) && <span>📍 {[data.city, data.country].filter(Boolean).join(', ')}</span>}
          {data.linkedin && <span>in {data.linkedin}</span>}
        </div>
      </div>

      {/* Accent line */}
      <div style={{ height: 4, background: accent }} />

      <div style={{ padding: '28px 40px', display: 'grid', gridTemplateColumns: '1fr 200px', gap: 32 }}>
        {/* Main */}
        <div>
          {data.summary && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{labels.summary}</div>
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#444', lineHeight: 1.65 }}>{data.summary}</div>
            </div>
          )}

          {data.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 14 }}>{labels.exp}</div>
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: `3px solid ${accent}` }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 800, fontSize: 13 }}>{e.position}</div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, marginBottom: 6 }}>
                    <span contentEditable suppressContentEditableWarning style={{ color: accent, fontWeight: 600 }}>{e.company}{e.city ? ` · ${e.city}` : ''}</span>
                    <span style={{ color: '#999' }}>|</span>
                    <span style={{ color: '#999' }}>{e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? labels.present : e.endDate}</span>
                  </div>
                  {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#333', marginBottom: 4, lineHeight: 1.6 }}>→ {b}</div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>{labels.edu}</div>
              {data.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: `3px solid #e5e7eb` }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                  <div style={{ fontSize: 12 }}>
                    <span contentEditable suppressContentEditableWarning style={{ color: accent }}>{e.school}</span>
                    <span style={{ color: '#999' }}> · {e.startDate} – {e.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{labels.skills}</div>
              {data.skills.map((s, i) => (
                <div key={i} style={{ fontSize: 12, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, background: accent, borderRadius: 1, flexShrink: 0 }} />
                  {s}
                </div>
              ))}
            </div>
          )}

          {data.languages.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{labels.langs}</div>
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>{l.name}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{l.level}</div>
                </div>
              ))}
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{labels.certs}</div>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 11 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#888' }}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
