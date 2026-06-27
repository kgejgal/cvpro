import type { CVData } from '@/lib/cv/types'

function hex2rgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff }
}

export default function StartupTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const { r, g, b } = hex2rgb(accent)
  const a = (alpha: number) => `rgba(${r},${g},${b},${alpha})`
  const isPresent = (d: string) => d === 'present' || d === 'obecnie'

  const L = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'About', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'O mnie', present: 'obecnie' }

  const Tag = ({ text }: { text: string }) => (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: a(0.12), color: accent, border: `1px solid ${a(0.25)}`, marginRight: 5, marginBottom: 5 }}>{text}</span>
  )

  const SectionTitle = ({ title }: { title: string }) => (
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: accent, textTransform: 'uppercase', marginBottom: 12, marginTop: 22 }}>{title}</div>
  )

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#f8faff', fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', fontSize: 13, color: '#1a2035', '--cv-accent': accent } as React.CSSProperties}>
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${a(0.75)} 100%)`, padding: '36px 44px 30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 100, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {data.photo
              ? <img src={data.photo} alt="" style={{ width: 74, height: 74, borderRadius: 14, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
              : <div style={{ width: 74, height: 74, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 800, flexShrink: 0, border: '3px solid rgba(255,255,255,0.3)' }}>
                  {data.firstName?.[0]}{data.lastName?.[0]}
                </div>
            }
            <div>
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                {data.firstName} {data.lastName}
              </div>
              {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: 500, marginTop: 4 }}>{data.title}</div>}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'right', lineHeight: 1.9 }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>📞 {data.phone}</div>}
            {(data.city || data.country) && <div>📍 {[data.city, data.country].filter(Boolean).join(', ')}</div>}
            {data.linkedin && <div>in {data.linkedin}</div>}
            {data.github && <div>⌥ {data.github}</div>}
            {data.website && <div>🌐 {data.website}</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 44px 40px', display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32 }}>
        <div>
          {data.summary && (
            <>
              <SectionTitle title={L.summary} />
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#3a4a5c', lineHeight: 1.72, background: '#fff', borderRadius: 10, padding: '12px 16px', border: `1px solid ${a(0.12)}` }}>{data.summary}</div>
            </>
          )}

          {data.experience.length > 0 && (
            <>
              <SectionTitle title={L.exp} />
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 16, background: '#fff', borderRadius: 10, padding: '14px 16px', border: `1px solid ${a(0.1)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 800, fontSize: 14, color: '#0f1827' }}>{e.position}</div>
                      <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600 }}>
                        {e.company}{e.city ? ` · ${e.city}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#8a9ab0', background: '#f0f4fa', padding: '3px 9px', borderRadius: 8, flexShrink: 0 }}>
                      {e.startDate} – {isPresent(e.endDate) ? L.present : e.endDate}
                    </span>
                  </div>
                  {(e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} style={{ fontSize: 12, color: '#3a4a5c', lineHeight: 1.62, marginTop: j === 0 ? 8 : 2, display: 'flex', gap: 7 }}>
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
                <div key={i} style={{ marginBottom: 12, background: '#fff', borderRadius: 10, padding: '12px 16px', border: `1px solid ${a(0.1)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 13, color: '#0f1827' }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                      <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{e.school}</div>
                    </div>
                    <span style={{ fontSize: 10, color: '#8a9ab0', flexShrink: 0 }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ paddingTop: 4 }}>
          {data.skills.length > 0 && (
            <>
              <SectionTitle title={L.skills} />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {data.skills.map((s, i) => <Tag key={i} text={s} />)}
              </div>
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <SectionTitle title={L.langs} />
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 8, background: '#fff', borderRadius: 8, padding: '8px 12px', border: `1px solid ${a(0.1)}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f1827' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: '#8a9ab0' }}>{l.level}</div>
                </div>
              ))}
            </>
          )}

          {(data.certifications ?? []).length > 0 && (
            <>
              <SectionTitle title={L.certs} />
              {(data.certifications ?? []).map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, fontWeight: 700, color: '#0f1827' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: 11, color: '#8a9ab0' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: 10, color: '#aab0bc' }}>{c.date}</div>}
                </div>
              ))}
            </>
          )}

          {(data.hobbies ?? []).length > 0 && (
            <>
              <SectionTitle title={L.hobbies} />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {(data.hobbies ?? []).map((h, i) => <Tag key={i} text={h} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
