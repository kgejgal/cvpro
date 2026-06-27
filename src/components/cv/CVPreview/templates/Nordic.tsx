import type { CVData } from '@/lib/cv/types'

export default function NordicTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const isPresent = (d: string) => d === 'present' || d === 'obecnie'

  const L = data.language === 'en'
    ? { exp: 'Work Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Summary', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'Podsumowanie', present: 'obecnie' }

  const Divider = () => <div style={{ height: 1, background: '#e8edf2', margin: '18px 0' }} />

  const SectionTitle = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, marginTop: 28 }}>
      <div style={{ width: 20, height: 2, background: accent, borderRadius: 1 }} />
      <span style={{ fontSize: 10, fontWeight: 800, color: '#9aabb8', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{title}</span>
    </div>
  )

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', fontSize: 13, color: '#1e2832', '--cv-accent': accent } as React.CSSProperties}>
      <div style={{ padding: '52px 64px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.035em', color: '#0d1520', lineHeight: 1.1 }}>
              {data.firstName}<br />{data.lastName}
            </div>
            {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 14, color: accent, fontWeight: 600, marginTop: 10, letterSpacing: '0.01em' }}>{data.title}</div>}
          </div>
          {data.photo
            ? <img src={data.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}22` }} />
            : null
          }
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
          {data.email && <span style={{ fontSize: 11, color: '#6a7a8a' }}>✉ {data.email}</span>}
          {data.phone && <span style={{ fontSize: 11, color: '#6a7a8a' }}>📞 {data.phone}</span>}
          {(data.city || data.country) && <span style={{ fontSize: 11, color: '#6a7a8a' }}>📍 {[data.city, data.country].filter(Boolean).join(', ')}</span>}
          {data.linkedin && <span style={{ fontSize: 11, color: accent }}>in {data.linkedin}</span>}
          {data.github && <span style={{ fontSize: 11, color: accent }}>⌥ {data.github}</span>}
          {data.website && <span style={{ fontSize: 11, color: accent }}>🌐 {data.website}</span>}
        </div>

        <Divider />

        {data.summary && (
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#4a5868', lineHeight: 1.8, maxWidth: 560 }}>
            {data.summary}
          </div>
        )}
      </div>

      <div style={{ padding: '0 64px 40px', display: 'grid', gridTemplateColumns: '1fr 220px', gap: 48 }}>
        <div>
          {data.experience.length > 0 && (
            <>
              <SectionTitle title={L.exp} />
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 14, color: '#0d1520' }}>{e.position}</div>
                    <span style={{ fontSize: 11, color: '#9aabb8', flexShrink: 0 }}>
                      {e.startDate} – {isPresent(e.endDate) ? L.present : e.endDate}
                    </span>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600, marginTop: 2, marginBottom: 6 }}>
                    {e.company}{e.city ? ` · ${e.city}` : ''}
                  </div>
                  {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#4a5868', lineHeight: 1.7, display: 'flex', gap: 7, marginBottom: 2 }}>
                      <span style={{ color: accent, flexShrink: 0 }}>–</span>
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
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13, color: '#0d1520' }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                    <span style={{ fontSize: 11, color: '#9aabb8', flexShrink: 0 }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600, marginTop: 2 }}>{e.school}</div>
                  {e.grade && <div style={{ fontSize: 11, color: '#5a6878', marginTop: 3 }}>{e.grade}</div>}
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ borderLeft: '1px solid #e8edf2', paddingLeft: 32 }}>
          {data.skills.length > 0 && (
            <>
              <SectionTitle title={L.skills} />
              {data.skills.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: '#2a3848', marginBottom: 7, paddingBottom: 7, borderBottom: i < data.skills.length - 1 ? '1px solid #f0f3f6' : 'none' }}>{s}</div>
              ))}
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <SectionTitle title={L.langs} />
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1e2832' }}>{l.name}</span>
                    <span style={{ fontSize: 10, color: '#9aabb8' }}>{l.level?.split(' ')[0]}</span>
                  </div>
                  <div style={{ height: 2, background: '#e8edf2', borderRadius: 1, marginTop: 4 }}>
                    <div style={{ height: '100%', borderRadius: 1, background: accent, width: l.level?.startsWith('C') ? '100%' : l.level?.startsWith('B2') ? '80%' : l.level?.startsWith('B1') ? '65%' : l.level?.startsWith('A') ? '35%' : '90%' }} />
                  </div>
                </div>
              ))}
            </>
          )}

          {(data.certifications ?? []).length > 0 && (
            <>
              <SectionTitle title={L.certs} />
              {(data.certifications ?? []).map((c, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, fontWeight: 700, color: '#1e2832' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: 11, color: '#9aabb8' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: 10, color: '#b0bcc8' }}>{c.date}</div>}
                </div>
              ))}
            </>
          )}

          {(data.hobbies ?? []).length > 0 && (
            <>
              <SectionTitle title={L.hobbies} />
              {(data.hobbies ?? []).map((h, i) => (
                <div key={i} style={{ fontSize: 12, color: '#4a5868', marginBottom: 5 }}>{h}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
