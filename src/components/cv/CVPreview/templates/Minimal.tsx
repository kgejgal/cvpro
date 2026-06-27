import type { CVData } from '@/lib/cv/types'

export default function MinimalTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const L = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', summary: 'Summary', present: 'present', certs: 'Certifications' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', summary: 'Podsumowanie', present: 'obecnie', certs: 'Certyfikaty' }

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', fontSize: 13, color: '#1a1a1a', padding: '48px 56px' }}>
      {/* Ultra minimal header */}
      <div style={{ marginBottom: 36, paddingBottom: 20, borderBottom: `1px solid #e5e7eb` }}>
        <div contentEditable suppressContentEditableWarning style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, color: '#111' }}>{data.firstName} {data.lastName}</div>
        {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 15, color: accent, fontWeight: 500, marginTop: 4 }}>{data.title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 18px', marginTop: 10, fontSize: 12, color: '#555' }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.city && <span>{data.city}{data.country ? `, ${data.country}` : ''}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {data.summary && (
        <div style={{ marginBottom: 28 }}>
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: '#444', lineHeight: 1.75 }}>{data.summary}</div>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 16 }}>{L.exp}</div>
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 20, display: 'grid', gridTemplateColumns: '100px 1fr', gap: 16 }}>
              <div style={{ fontSize: 11, color: '#aaa', paddingTop: 2, lineHeight: 1.5 }}>
                {e.startDate}<br />–<br />{e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}
              </div>
              <div>
                <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{e.position}</div>
                <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, marginBottom: 6 }}>{e.company}{e.city ? `, ${e.city}` : ''}</div>
                {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                  <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: '#555', marginBottom: 3, lineHeight: 1.65 }}>— {b}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          {data.education.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 14 }}>{L.edu}</div>
              {data.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 12 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                  <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent }}>{e.school}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 14 }}>{L.skills}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {data.skills.map((s, i) => (
                  <span key={i} style={{ fontSize: 11, color: '#444', background: '#f5f5f5', padding: '3px 10px', borderRadius: 4 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 14 }}>{L.langs}</div>
              {data.languages.map((l, i) => (
                <div key={i} style={{ fontSize: 12, marginBottom: 5 }}>{l.name} <span style={{ color: '#aaa' }}>— {l.level}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
