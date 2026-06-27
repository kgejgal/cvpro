import type { CVData } from '@/lib/cv/types'

export default function WarsawTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const isPresent = (d: string) => d === 'present' || d === 'obecnie'

  const L = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Profile', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'Profil zawodowy', present: 'obecnie' }

  const SectionTitle = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 22 }}>
      <div style={{ width: 4, height: 18, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: accent, textTransform: 'uppercase' }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: '#e8ecf0' }} />
    </div>
  )

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-onest), Onest, sans-serif', fontSize: 13, color: '#1e2a3a', '--cv-accent': accent } as React.CSSProperties}>
      <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />

      <div style={{ padding: '28px 40px 20px', borderBottom: '1px solid #e8ecf0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {data.photo
            ? <img src={data.photo} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            : <div style={{ width: 80, height: 80, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
                {data.firstName?.[0]}{data.lastName?.[0]}
              </div>
          }
          <div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color: '#0f1a2a' }}>
              {data.firstName} {data.lastName}
            </div>
            {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: accent, fontWeight: 600, marginTop: 4 }}>{data.title}</div>}
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#556070', lineHeight: 1.85, textAlign: 'right', flexShrink: 0 }}>
          {data.email && <div>✉ {data.email}</div>}
          {data.phone && <div>📞 {data.phone}</div>}
          {(data.city || data.country) && <div>📍 {[data.city, data.country].filter(Boolean).join(', ')}</div>}
          {data.linkedin && <div>in {data.linkedin}</div>}
          {data.github && <div>⌥ {data.github}</div>}
          {data.website && <div>🌐 {data.website}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', padding: '0 40px 32px' }}>
        <div style={{ flex: 1, paddingRight: 32, paddingTop: 4 }}>
          {data.summary && (
            <>
              <SectionTitle title={L.summary} />
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.7 }}>{data.summary}</div>
            </>
          )}

          {data.experience.length > 0 && (
            <>
              <SectionTitle title={L.exp} />
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 14, color: '#0f1a2a' }}>{e.position}</div>
                    <div style={{ fontSize: 11, color: '#7a8a9a', flexShrink: 0 }}>
                      {e.startDate} – {isPresent(e.endDate) ? L.present : e.endDate}
                    </div>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 5 }}>
                    {e.company}{e.city ? ` · ${e.city}` : ''}
                  </div>
                  {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#3a4a5c', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 2 }}>
                      <span style={{ color: accent, flexShrink: 0 }}>▸</span>
                      <span contentEditable suppressContentEditableWarning>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {data.education.length > 0 && (
            <>
              <SectionTitle title={L.edu} />
              {data.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13, color: '#0f1a2a' }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                    <div style={{ fontSize: 11, color: '#7a8a9a', flexShrink: 0 }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</div>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{e.school}</div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ width: 190, paddingTop: 4, borderLeft: '1px solid #e8ecf0', paddingLeft: 24 }}>
          {data.skills.length > 0 && (
            <>
              <SectionTitle title={L.skills} />
              {data.skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#2a3a4a' }}>{s}</span>
                </div>
              ))}
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <SectionTitle title={L.langs} />
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e2a3a' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: '#7a8a9a' }}>{l.level}</div>
                </div>
              ))}
            </>
          )}

          {(data.certifications ?? []).length > 0 && (
            <>
              <SectionTitle title={L.certs} />
              {(data.certifications ?? []).map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, fontWeight: 700, color: '#1e2a3a' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: 11, color: '#7a8a9a' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: 11, color: '#9aabb8' }}>{c.date}</div>}
                </div>
              ))}
            </>
          )}

          {(data.hobbies ?? []).length > 0 && (
            <>
              <SectionTitle title={L.hobbies} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(data.hobbies ?? []).map((h, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 12, background: `${accent}18`, color: accent, fontWeight: 500 }}>{h}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
