import type { CVData } from '@/lib/cv/types'

export default function CreativeTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const L = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', summary: 'About', present: 'present', certs: 'Certs' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', summary: 'O mnie', present: 'obecnie', certs: 'Certyfikaty' }

  const initials = `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-onest), Onest, sans-serif', fontSize: 13, color: '#222', display: 'flex' }}>
      {/* Left accent bar */}
      <div style={{ width: 6, background: accent, flexShrink: 0 }} />
      {/* Left panel */}
      <div style={{ width: 210, background: '#f8f9fb', padding: '32px 18px', flexShrink: 0, borderRight: '1px solid #eee' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {data.photo
            ? <img src={data.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}` }} />
            : <div style={{ width: 80, height: 80, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 auto' }}>{initials}</div>
          }
          <div contentEditable suppressContentEditableWarning style={{ fontWeight: 800, fontSize: 15, marginTop: 12, lineHeight: 1.2 }}>{data.firstName}<br />{data.lastName}</div>
          {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: accent, fontWeight: 600, marginTop: 4 }}>{data.title}</div>}
        </div>
        <div style={{ fontSize: 11, color: '#555', lineHeight: 2, marginBottom: 20 }}>
          {data.email && <div>✉ {data.email}</div>}
          {data.phone && <div>📞 {data.phone}</div>}
          {data.city && <div>📍 {data.city}{data.country ? `, ${data.country}` : ''}</div>}
          {data.linkedin && <div style={{ wordBreak: 'break-all' }}>in {data.linkedin}</div>}
        </div>
        {data.skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{L.skills}</div>
            {data.skills.map((s, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, background: accent, borderRadius: 1, flexShrink: 0 }} />{s}
              </div>
            ))}
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{L.langs}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={{ marginBottom: 7, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>{l.name}</div>
                <div style={{ color: '#777', fontSize: 11 }}>{l.level}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main */}
      <div style={{ flex: 1, padding: '32px 28px' }}>
        {data.summary && (
          <div style={{ marginBottom: 24, padding: '14px 18px', borderLeft: `4px solid ${accent}`, background: `${accent}0a` }}>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{data.summary}</div>
          </div>
        )}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 14 }}>{L.exp}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 800, fontSize: 13 }}>{e.position}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}</div>
                </div>
                <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 6 }}>{e.company}{e.city ? ` · ${e.city}` : ''}</div>
                {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                  <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#444', paddingLeft: 14, marginBottom: 4, lineHeight: 1.6, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 800 }}>›</span>{b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>{L.edu}</div>
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent }}>{e.school}</div>
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>{e.startDate}–{e.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
