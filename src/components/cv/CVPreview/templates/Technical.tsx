import type { CVData } from '@/lib/cv/types'

export default function TechnicalTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const L = data.language === 'en'
    ? { exp: 'Work Experience', edu: 'Education', skills: 'Technical Skills', langs: 'Languages', summary: 'Profile', present: 'present', certs: 'Certifications', github: 'GitHub' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności techniczne', langs: 'Języki', summary: 'Profil', present: 'obecnie', certs: 'Certyfikaty', github: 'GitHub' }

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#0f172a', fontFamily: '"Courier New", Courier, monospace', fontSize: 12, color: '#e2e8f0' }}>
      {/* Terminal-style header */}
      <div style={{ padding: '28px 36px 20px', borderBottom: `1px solid ${accent}40` }}>
        <div style={{ fontSize: 11, color: accent, marginBottom: 8, fontFamily: 'monospace' }}>{'// CURRICULUM VITAE'}</div>
        <div contentEditable suppressContentEditableWarning style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace', color: '#fff', letterSpacing: -0.5 }}>{data.firstName}_{data.lastName}</div>
        {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: accent, marginTop: 4 }}>{`> ${data.title}`}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: 10, fontSize: 11, color: '#94a3b8' }}>
          {data.email && <span>mail: {data.email}</span>}
          {data.phone && <span>tel: {data.phone}</span>}
          {data.city && <span>loc: {data.city}{data.country ? `, ${data.country}` : ''}</span>}
          {data.github && <span>gh: {data.github}</span>}
          {data.linkedin && <span>in: {data.linkedin}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
        {/* Main */}
        <div style={{ padding: '20px 28px 20px 36px', borderRight: `1px solid ${accent}30` }}>
          {data.summary && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{`/* ${L.summary} */`}</div>
              <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>{data.summary}</div>
            </div>
          )}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>{`/* ${L.exp} */`}</div>
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 16, paddingLeft: 12, borderLeft: `1px solid ${accent}50` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, color: '#fff' }}>{e.position}</div>
                    <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>[{e.startDate} → {e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}]</div>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: accent, marginBottom: 6 }}>{e.company}{e.city ? ` @ ${e.city}` : ''}</div>
                  {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: '#94a3b8', paddingLeft: 12, marginBottom: 3, lineHeight: 1.6 }}>
                      {'→ '}{b}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>{`/* ${L.edu} */`}</div>
              {data.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{e.startDate}–{e.endDate}</div>
                  </div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: accent }}>{e.school}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ padding: '20px 18px', background: '#0d1629' }}>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{`// ${L.skills}`}</div>
              {data.skills.map((s, i) => (
                <div key={i} style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, display: 'flex', gap: 6 }}>
                  <span style={{ color: accent }}>▸</span>{s}
                </div>
              ))}
            </div>
          )}
          {data.languages.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{`// ${L.langs}`}</div>
              {data.languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 7, fontSize: 11 }}>
                  <div style={{ color: '#fff' }}>{l.name}</div>
                  <div style={{ color: '#64748b', fontSize: 10 }}>{l.level}</div>
                </div>
              ))}
            </div>
          )}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{`// ${L.certs}`}</div>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 11 }}>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#64748b', fontSize: 10 }}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
