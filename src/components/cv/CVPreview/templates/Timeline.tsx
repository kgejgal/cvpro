import type { CVData } from '@/lib/cv/types'

function hex2rgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff }
}

export default function TimelineTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const { r, g, b } = hex2rgb(accent)
  const a = (alpha: number) => `rgba(${r},${g},${b},${alpha})`
  const isPresent = (d: string) => d === 'present' || d === 'obecnie'

  const L = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', hobbies: 'Interests', certs: 'Certifications', summary: 'Profile', present: 'present' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', hobbies: 'Zainteresowania', certs: 'Certyfikaty', summary: 'Profil', present: 'obecnie' }

  const SectionTitle = ({ title }: { title: string }) => (
    <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: '0.13em', textTransform: 'uppercase', margin: '24px 0 14px' }}>{title}</div>
  )

  const TimelineItem = ({ title, sub, date, bullets }: { title: string; sub?: string; date?: string; bullets?: string[] }) => (
    <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, border: `2px solid ${a(0.25)}`, flexShrink: 0, marginTop: 2 }} />
        <div style={{ width: 2, flex: 1, background: `linear-gradient(${a(0.3)}, ${a(0.05)})`, marginTop: 4, borderRadius: 1 }} />
      </div>
      <div style={{ paddingLeft: 12, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 14, color: '#0f1827' }}>{title}</div>
          {date && <span style={{ fontSize: 10, color: '#8a9ab0', flexShrink: 0, marginLeft: 8 }}>{date}</span>}
        </div>
        {sub && <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 4 }}>{sub}</div>}
        {(bullets ?? []).filter(Boolean).map((b, i) => (
          <div key={i} style={{ fontSize: 12, color: '#4a5a6a', lineHeight: 1.62, display: 'flex', gap: 7, marginBottom: 2 }}>
            <span style={{ color: accent, flexShrink: 0 }}>▸</span>
            <span contentEditable suppressContentEditableWarning>{b}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-onest), Onest, sans-serif', fontSize: 13, color: '#1a2035', '--cv-accent': accent } as React.CSSProperties}>
      <div style={{ padding: '36px 40px 28px', background: '#0f1827', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, ${a(0.4)})` }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: a(0.06) }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {data.photo
              ? <img src={data.photo} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />
              : <div style={{ width: 76, height: 76, borderRadius: '50%', background: a(0.2), border: `3px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 800, flexShrink: 0 }}>
                  {data.firstName?.[0]}{data.lastName?.[0]}
                </div>
            }
            <div>
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                {data.firstName} {data.lastName}
              </div>
              {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: accent, fontWeight: 600, marginTop: 5 }}>{data.title}</div>}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'right', lineHeight: 1.9 }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>📞 {data.phone}</div>}
            {(data.city || data.country) && <div>📍 {[data.city, data.country].filter(Boolean).join(', ')}</div>}
            {data.linkedin && <div>in {data.linkedin}</div>}
            {data.github && <div>⌥ {data.github}</div>}
          </div>
        </div>
        {data.summary && (
          <div contentEditable suppressContentEditableWarning style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, maxWidth: 600 }}>
            {data.summary}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 0 }}>
        <div style={{ padding: '8px 32px 32px 40px' }}>
          {data.experience.length > 0 && (
            <>
              <SectionTitle title={L.exp} />
              {data.experience.map((e, i) => (
                <TimelineItem key={i}
                  title={e.position}
                  sub={`${e.company}${e.city ? ` · ${e.city}` : ''}`}
                  date={`${e.startDate} – ${isPresent(e.endDate) ? L.present : e.endDate}`}
                  bullets={e.bullets}
                />
              ))}
            </>
          )}

          {data.education.length > 0 && (
            <>
              <SectionTitle title={L.edu} />
              {data.education.map((e, i) => (
                <TimelineItem key={i}
                  title={`${e.degree}${e.field ? ` — ${e.field}` : ''}`}
                  sub={e.school}
                  date={`${e.startDate}${e.endDate ? ` – ${e.endDate}` : ''}`}
                />
              ))}
            </>
          )}
        </div>

        <div style={{ background: '#f7f9fc', borderLeft: `1px solid ${a(0.1)}`, padding: '24px 20px 32px' }}>
          {data.skills.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{L.skills}</div>
              {data.skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#2a3a4a' }}>{s}</span>
                </div>
              ))}
            </>
          )}

          {data.languages.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 20, marginBottom: 10 }}>{L.langs}</div>
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a2035' }}>{l.name}</div>
                  <div style={{ height: 3, borderRadius: 2, background: '#e2e8f0', marginTop: 3 }}>
                    <div style={{ height: '100%', borderRadius: 2, background: accent, width: l.level?.startsWith('C') ? '100%' : l.level?.startsWith('B2') ? '80%' : l.level?.startsWith('B1') ? '65%' : l.level?.startsWith('A') ? '35%' : '90%' }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#8a9ab0', marginTop: 2 }}>{l.level}</div>
                </div>
              ))}
            </>
          )}

          {(data.certifications ?? []).length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 20, marginBottom: 10 }}>{L.certs}</div>
              {(data.certifications ?? []).map((c, i) => (
                <div key={i} style={{ marginBottom: 8, borderLeft: `2px solid ${a(0.3)}`, paddingLeft: 8 }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, fontWeight: 700, color: '#1a2035' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: 10, color: '#8a9ab0' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: 10, color: '#aab0bc' }}>{c.date}</div>}
                </div>
              ))}
            </>
          )}

          {(data.hobbies ?? []).length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 20, marginBottom: 10 }}>{L.hobbies}</div>
              {(data.hobbies ?? []).map((h, i) => (
                <div key={i} style={{ fontSize: 12, color: '#4a5a6a', marginBottom: 4 }}>• {h}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
