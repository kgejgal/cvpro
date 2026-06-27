import type { CVData } from '@/lib/cv/types'

export default function ProfessionalTemplate({ data }: { data: CVData }) {
  const L = data.language === 'en'
    ? { exp: 'Work Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', summary: 'Professional Summary', present: 'Present', certs: 'Certifications' }
    : { exp: 'Doświadczenie zawodowe', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', summary: 'Podsumowanie zawodowe', present: 'Obecnie', certs: 'Certyfikaty' }

  const accent = data.colorTheme || '#2563eb'

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontSize: 12.5, color: '#222' }}>
      {/* Traditional top bar */}
      <div style={{ background: accent, height: 8 }} />
      <div style={{ padding: '28px 40px 20px', borderBottom: '2px solid #222' }}>
        <div contentEditable suppressContentEditableWarning style={{ fontSize: 26, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>{data.firstName} {data.lastName}</div>
        {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 13, color: accent, fontWeight: 600, marginTop: 4, letterSpacing: 1 }}>{data.title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 24px', marginTop: 8, fontSize: 11, color: '#555' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>☎ {data.phone}</span>}
          {data.city && <span>⊙ {data.city}{data.country ? `, ${data.country}` : ''}</span>}
          {data.linkedin && <span>⊕ {data.linkedin}</span>}
        </div>
      </div>

      <div style={{ padding: '20px 40px' }}>
        {data.summary && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 8 }}>{L.summary}</div>
            <div contentEditable suppressContentEditableWarning style={{ lineHeight: 1.65, color: '#333' }}>{data.summary}</div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 12 }}>{L.exp}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{e.position}</div>
                  <div style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>{e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}</div>
                </div>
                <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, fontStyle: 'italic', color: '#555', marginBottom: 6 }}>{e.company}{e.city ? `, ${e.city}` : ''}</div>
                <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                  {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                    <li key={j} contentEditable suppressContentEditableWarning style={{ marginBottom: 4, lineHeight: 1.55, color: '#333' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {data.education.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 10 }}>{L.edu}</div>
                {data.education.map((e, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                      <div style={{ fontSize: 11, color: '#555' }}>{e.startDate}–{e.endDate}</div>
                    </div>
                    <div contentEditable suppressContentEditableWarning style={{ fontStyle: 'italic', fontSize: 12, color: '#555' }}>{e.school}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {data.skills.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 10 }}>{L.skills}</div>
                <div style={{ columns: 2, gap: 8 }}>
                  {data.skills.map((s, i) => <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>• {s}</div>)}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 10 }}>{L.langs}</div>
                {data.languages.map((l, i) => <div key={i} style={{ fontSize: 12, marginBottom: 5 }}><strong>{l.name}</strong> — {l.level}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
