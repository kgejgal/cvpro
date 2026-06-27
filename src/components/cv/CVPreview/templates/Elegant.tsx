import type { CVData } from '@/lib/cv/types'

export default function ElegantTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'

  const labels = data.language === 'en'
    ? { exp: 'Professional Experience', edu: 'Education', skills: 'Core Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Professional Summary', present: 'present' }
    : { exp: 'Doświadczenie zawodowe', edu: 'Wykształcenie', skills: 'Kluczowe umiejętności', langs: 'Znajomość języków', hobbies: 'Zainteresowania', certs: 'Certyfikaty i kursy', summary: 'Podsumowanie zawodowe', present: 'obecnie' }

  return (
    <div
      id="cv-doc"
      style={{
        width: 794,
        minHeight: 1123,
        background: '#fff',
        fontFamily: 'var(--font-playfair), Playfair Display, serif',
        fontSize: 13,
        color: '#2c2c2c',
        '--cv-accent': accent,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div style={{ padding: '40px 48px 24px', borderBottom: `3px double ${accent}` }}>
        <div style={{ textAlign: 'center' }}>
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, color: '#1a1a1a' }}>
            {data.firstName} {data.lastName}
          </div>
          {data.title && (
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: accent, fontStyle: 'italic', marginTop: 6, fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
              {data.title}
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 11, color: '#666', fontFamily: 'var(--font-lato), Lato, sans-serif', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 20px' }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>📞 {data.phone}</span>}
            {(data.city || data.country) && <span>📍 {[data.city, data.country].filter(Boolean).join(', ')}</span>}
            {data.linkedin && <span>in {data.linkedin}</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 48px', fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
        {data.summary && (
          <div style={{ marginBottom: 28, textAlign: 'center', fontStyle: 'italic', color: '#444', fontSize: 13, lineHeight: 1.7, borderBottom: `1px solid #eee`, paddingBottom: 20 }}>
            <div contentEditable suppressContentEditableWarning>{data.summary}</div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 13, fontFamily: 'var(--font-playfair), serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 16, margin: '0 0 16px' }}>{labels.exp}</h2>
            <div style={{ borderTop: `1px solid ${accent}`, paddingTop: 14 }}>
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 18, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
                  <div style={{ fontSize: 11, color: '#888', paddingTop: 2 }}>
                    {e.startDate}<br />–<br />{e.endDate === 'present' || e.endDate === 'obecnie' ? labels.present : e.endDate}
                  </div>
                  <div>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{e.position}</div>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, marginBottom: 6, fontStyle: 'italic' }}>{e.company}{e.city ? `, ${e.city}` : ''}</div>
                    {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                      <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#444', paddingLeft: 12, marginBottom: 4, position: 'relative', lineHeight: 1.6 }}>
                        <span style={{ position: 'absolute', left: 0, color: accent }}>·</span>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            {data.education.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 13, fontFamily: 'var(--font-playfair), serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>{labels.edu}</h2>
                <div style={{ borderTop: `1px solid ${accent}`, paddingTop: 12 }}>
                  {data.education.map((e, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 12 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                      <div contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: accent, fontStyle: 'italic' }}>{e.school}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{e.startDate} – {e.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            {data.skills.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 13, fontFamily: 'var(--font-playfair), serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>{labels.skills}</h2>
                <div style={{ borderTop: `1px solid ${accent}`, paddingTop: 12 }}>
                  {data.skills.map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: '#444', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: accent, fontSize: 10 }}>◆</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <h2 style={{ fontSize: 13, fontFamily: 'var(--font-playfair), serif', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>{labels.langs}</h2>
                <div style={{ borderTop: `1px solid ${accent}`, paddingTop: 12 }}>
                  {data.languages.map((l, i) => (
                    <div key={i} style={{ marginBottom: 6, fontSize: 12 }}>
                      <span style={{ fontWeight: 700 }}>{l.name}</span> <span style={{ color: '#888', fontStyle: 'italic' }}>{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
