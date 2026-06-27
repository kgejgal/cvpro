import type { CVData } from '@/lib/cv/types'

export default function ModernTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'

  const labels = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'About Me', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'O mnie', present: 'obecnie' }

  return (
    <div
      id="cv-doc"
      style={{
        width: 794,
        minHeight: 1123,
        background: '#fff',
        fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
        fontSize: 13,
        color: '#2d3748',
        '--cv-accent': accent,
        '--cv-accent-deep': accent,
      } as React.CSSProperties}
    >
      {/* Header bar */}
      <div style={{ background: accent, padding: '28px 36px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
              {data.firstName} {data.lastName}
            </div>
            {data.title && (
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                {data.title}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, textAlign: 'right', opacity: 0.9, lineHeight: 1.7 }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>📞 {data.phone}</div>}
            {(data.city || data.country) && <div>📍 {[data.city, data.country].filter(Boolean).join(', ')}</div>}
            {data.linkedin && <div>in {data.linkedin}</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 36px' }}>
        {data.summary && (
          <div style={{ marginBottom: 24, padding: '14px 18px', background: '#f8fafc', borderLeft: `4px solid ${accent}`, borderRadius: 4 }}>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.65 }}>
              {data.summary}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32 }}>
          {/* Left col */}
          <div>
            {data.experience.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ height: 2, width: 20, background: accent }} /> {labels.exp}
                </div>
                {data.experience.map((e, i) => (
                  <div key={i} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: i < data.experience.length - 1 ? '1px solid #edf2f7' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</div>
                      <div style={{ fontSize: 11, color: '#7a8594', whiteSpace: 'nowrap' }}>
                        {e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? labels.present : e.endDate}
                      </div>
                    </div>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, marginBottom: 6 }}>{e.company}{e.city ? ` · ${e.city}` : ''}</div>
                    <ul className="cv2-bullet" style={{ '--cv-accent': accent } as React.CSSProperties}>
                      {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                        <li key={j} contentEditable suppressContentEditableWarning>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {data.education.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ height: 2, width: 20, background: accent }} /> {labels.edu}
                </div>
                {data.education.map((e, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 600 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                      <div style={{ fontSize: 11, color: '#7a8594' }}>{e.startDate} – {e.endDate}</div>
                    </div>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent }}>{e.school}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right col */}
          <div>
            {data.skills.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>{labels.skills}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.skills.map((s, i) => (
                    <span key={i} style={{ fontSize: 11, background: '#f0f4ff', color: accent, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.languages.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>{labels.langs}</div>
                {data.languages.map((l, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: '#7a8594' }}>{l.level}</div>
                  </div>
                ))}
              </div>
            )}

            {data.certifications && data.certifications.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>{labels.certs}</div>
                {data.certifications.map((c, i) => (
                  <div key={i} style={{ marginBottom: 8, fontSize: 12 }}>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ color: '#7a8594', fontSize: 11 }}>{c.issuer} · {c.date}</div>
                  </div>
                ))}
              </div>
            )}

            {data.hobbies && data.hobbies.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>{labels.hobbies}</div>
                {data.hobbies.map((h, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#4a5568', marginBottom: 4 }}>• {h}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
