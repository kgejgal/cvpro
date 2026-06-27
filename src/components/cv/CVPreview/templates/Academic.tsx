import type { CVData } from '@/lib/cv/types'

export default function AcademicTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const isPresent = (d: string) => d === 'present' || d === 'obecnie'

  const L = data.language === 'en'
    ? { exp: 'Work Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Professional Summary', present: 'present' }
    : { exp: 'Doświadczenie zawodowe', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'Podsumowanie zawodowe', present: 'obecnie' }

  const Section = ({ title }: { title: string }) => (
    <div style={{ borderBottom: `2px solid ${accent}`, marginBottom: 12, marginTop: 24, paddingBottom: 4 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', letterSpacing: '0.04em', fontFamily: 'Georgia, serif' }}>{title}</span>
    </div>
  )

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fdfcfa', fontFamily: 'Georgia, serif', fontSize: 13, color: '#1a1a2e', '--cv-accent': accent } as React.CSSProperties}>
      <div style={{ textAlign: 'center', padding: '40px 60px 24px', borderBottom: '1px solid #d0cec8', position: 'relative' }}>
        <div contentEditable suppressContentEditableWarning style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.01em', color: '#0d0d1a', fontFamily: 'Georgia, serif', marginBottom: 6 }}>
          {data.firstName} {data.lastName}
        </div>
        {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 15, color: '#4a5568', fontStyle: 'italic', marginBottom: 12 }}>{data.title}</div>}
        <div style={{ fontSize: 11, color: '#6a7585', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 20px' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {(data.city || data.country) && <span>📍 {[data.city, data.country].filter(Boolean).join(', ')}</span>}
          {data.linkedin && <span>in {data.linkedin}</span>}
          {data.github && <span>⌥ {data.github}</span>}
          {data.website && <span>🌐 {data.website}</span>}
        </div>
        {data.photo && (
          <img src={data.photo} alt="" style={{ position: 'absolute', top: 32, right: 60, width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}` }} />
        )}
      </div>

      <div style={{ padding: '0 60px 40px' }}>
        {data.summary && (
          <>
            <Section title={L.summary} />
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#3a4658', lineHeight: 1.75, fontStyle: 'italic' }}>{data.summary}</div>
          </>
        )}

        {data.experience.length > 0 && (
          <>
            <Section title={L.exp} />
            {data.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0 20px' }}>
                <div style={{ fontSize: 11, color: '#7a8a9a', paddingTop: 2, lineHeight: 1.6, fontFamily: 'Georgia, serif' }}>
                  {e.startDate} –<br />{isPresent(e.endDate) ? L.present : e.endDate}
                </div>
                <div>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 14, color: '#0d0d1a' }}>{e.position}</div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, marginBottom: 4, fontStyle: 'italic' }}>
                    {e.company}{e.city ? `, ${e.city}` : ''}
                  </div>
                  {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#3a4658', lineHeight: 1.65, display: 'flex', gap: 7, marginBottom: 2 }}>
                      <span style={{ color: accent, flexShrink: 0 }}>▪</span>
                      <span contentEditable suppressContentEditableWarning>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Section title={L.edu} />
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0 20px' }}>
                <div style={{ fontSize: 11, color: '#7a8a9a', paddingTop: 2, fontFamily: 'Georgia, serif' }}>
                  {e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}
                </div>
                <div>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13, color: '#0d0d1a' }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontStyle: 'italic' }}>{e.school}</div>
                  {e.grade && <div style={{ fontSize: 11, color: '#5a6878', marginTop: 2 }}>{e.grade}</div>}
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
          {data.skills.length > 0 && (
            <div>
              <Section title={L.skills} />
              {data.skills.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: '#2a3a4a', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ color: accent }}>▪</span> {s}
                </div>
              ))}
            </div>
          )}
          <div>
            {data.languages.length > 0 && (
              <>
                <Section title={L.langs} />
                {data.languages.map((l, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#2a3a4a', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{l.name}</span> — {l.level}
                  </div>
                ))}
              </>
            )}
            {(data.certifications ?? []).length > 0 && (
              <>
                <Section title={L.certs} />
                {(data.certifications ?? []).map((c, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{c.name}</div>
                    {c.issuer && <div style={{ fontSize: 11, color: '#7a8a9a', fontStyle: 'italic' }}>{c.issuer}{c.date ? `, ${c.date}` : ''}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
