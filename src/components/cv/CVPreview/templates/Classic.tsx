import type { CVData } from '@/lib/cv/types'

function tint(hex: string, amount: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) + (255 - ((n >> 16) & 0xff)) * amount))
  const g = Math.min(255, Math.round(((n >> 8) & 0xff) + (255 - ((n >> 8) & 0xff)) * amount))
  const b = Math.min(255, Math.round((n & 0xff) + (255 - (n & 0xff)) * amount))
  return `rgb(${r},${g},${b})`
}

export default function ClassicTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const bg = tint(accent, 0.93)
  const bg2 = tint(accent, 0.85)

  const labels = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Profile', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'Profil zawodowy', present: 'obecnie' }

  return (
    <div
      id="cv-doc"
      style={{
        width: 794,
        minHeight: 1123,
        background: '#fff',
        fontFamily: 'var(--font-poppins), Poppins, sans-serif',
        display: 'flex',
        fontSize: 13,
        color: '#2d3748',
        '--cv-accent': accent,
        '--cv-accent-deep': accent,
        '--cv-tint': bg,
        '--cv-tint-2': bg2,
      } as React.CSSProperties}
    >
      {/* Left sidebar */}
      <div className="cv-panel" style={{ width: 220, padding: '32px 20px', flexShrink: 0, background: bg }}>
        <div style={{ marginBottom: 28 }}>
          {data.photo
            ? <img src={data.photo} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2.5px solid ${accent}`, marginBottom: 14 }} />
            : <div style={{ width: 72, height: 72, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 700, marginBottom: 14 }}>
                {data.firstName?.[0] || '?'}{data.lastName?.[0] || ''}
              </div>
          }
          {data.email && <div style={{ fontSize: 11, color: '#5d626c', marginBottom: 4, wordBreak: 'break-all' }}>✉ {data.email}</div>}
          {data.phone && <div style={{ fontSize: 11, color: '#5d626c', marginBottom: 4 }}>📞 {data.phone}</div>}
          {(data.city || data.country) && <div style={{ fontSize: 11, color: '#5d626c', marginBottom: 4 }}>📍 {[data.city, data.country].filter(Boolean).join(', ')}</div>}
          {data.linkedin && <div style={{ fontSize: 11, color: accent, marginBottom: 4, wordBreak: 'break-all' }}>in {data.linkedin}</div>}
          {data.github && <div style={{ fontSize: 11, color: accent, marginBottom: 4 }}>⌥ {data.github}</div>}
        </div>

        {data.skills.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div className="cv-section-title">{labels.skills}</div>
            {data.skills.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: '#3d4a5c', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div className="cv-section-title">{labels.langs}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={{ fontSize: 12, color: '#3d4a5c', marginBottom: 5 }}>
                <div style={{ fontWeight: 600 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: '#7a8594' }}>{l.level}</div>
              </div>
            ))}
          </div>
        )}

        {data.hobbies && data.hobbies.length > 0 && (
          <div>
            <div className="cv-section-title">{labels.hobbies}</div>
            {data.hobbies.map((h, i) => (
              <div key={i} style={{ fontSize: 12, color: '#3d4a5c', marginBottom: 4 }}>• {h}</div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px 28px' }}>
        <div style={{ marginBottom: 24 }}>
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
            {data.firstName} {data.lastName}
          </div>
          {data.title && (
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: accent, fontWeight: 500, marginTop: 4 }}>
              {data.title}
            </div>
          )}
        </div>

        {data.summary && (
          <div style={{ marginBottom: 24 }}>
            <div className="cv-section-title">{labels.summary}</div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.65 }}>
              {data.summary}
            </div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="cv-section-title">{labels.exp}</div>
            <div className="cv-timeline">
              {data.experience.map((e, i) => (
                <div key={i} className="cv-exp-item" style={{ paddingLeft: 18, marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{e.position}</div>
                      <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent }}>{e.company}{e.city ? `, ${e.city}` : ''}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#7a8594', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? (data.language === 'en' ? 'present' : 'obecnie') : e.endDate}
                    </div>
                  </div>
                  {(e.bullets ?? []).length > 0 && (
                    <ul className="cv-exp-list" style={{ marginTop: 6 }}>
                      {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                        <li key={j} contentEditable suppressContentEditableWarning>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="cv-section-title">{labels.edu}</div>
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 600, fontSize: 13 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent }}>{e.school}</div>
                    {e.grade && <div style={{ fontSize: 11, color: '#7a8594' }}>{e.grade}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: '#7a8594', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {e.startDate} – {e.endDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div>
            <div className="cv-section-title">{labels.certs}</div>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 8, fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#7a8594' }}> · {c.issuer}</span>}
                {c.date && <span style={{ color: '#7a8594' }}> · {c.date}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
