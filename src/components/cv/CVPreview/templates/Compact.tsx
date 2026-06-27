import type { CVData } from '@/lib/cv/types'

export default function CompactTemplate({ data }: { data: CVData }) {
  const accent = data.colorTheme || '#2563eb'
  const L = data.language === 'en'
    ? { exp: 'Experience', edu: 'Education', skills: 'Skills', langs: 'Languages', summary: 'Summary', present: 'now', certs: 'Certifications' }
    : { exp: 'Doświadczenie', edu: 'Wykształcenie', skills: 'Umiejętności', langs: 'Języki', summary: 'Podsumowanie', present: 'teraz', certs: 'Certyfikaty' }

  const SectionTitle = ({ children }: { children: string }) => (
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: accent, borderBottom: `1px solid ${accent}40`, paddingBottom: 3, marginBottom: 8 }}>{children}</div>
  )

  return (
    <div id="cv-doc" style={{ width: 794, minHeight: 1123, background: '#fff', fontFamily: 'var(--font-lato), Lato, sans-serif', fontSize: 11.5, color: '#222', padding: '28px 36px' }}>
      {/* Compact header — everything on one block */}
      <div style={{ marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${accent}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{data.firstName} {data.lastName}</div>
            {data.title && <div contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: accent, fontWeight: 600, marginTop: 3 }}>{data.title}</div>}
          </div>
          <div style={{ fontSize: 10, color: '#555', textAlign: 'right', lineHeight: 1.7 }}>
            {data.email && <div>{data.email}</div>}
            {data.phone && <div>{data.phone}</div>}
            {data.city && <div>{data.city}{data.country ? `, ${data.country}` : ''}</div>}
            {data.linkedin && <div>{data.linkedin}</div>}
          </div>
        </div>
      </div>

      {data.summary && (
        <div style={{ marginBottom: 12 }}>
          <SectionTitle>{L.summary}</SectionTitle>
          <div contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: '#444', lineHeight: 1.6 }}>{data.summary}</div>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <SectionTitle>{L.exp}</SectionTitle>
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: 1.4 }}>
                <div>
                  <span contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>{e.position}</span>
                  <span style={{ color: accent, marginLeft: 6, fontSize: 11 }}>— {e.company}{e.city ? `, ${e.city}` : ''}</span>
                </div>
                <div style={{ fontSize: 10, color: '#777', whiteSpace: 'nowrap', marginLeft: 8 }}>{e.startDate} – {e.endDate === 'present' || e.endDate === 'obecnie' ? L.present : e.endDate}</div>
              </div>
              {( e.bullets ?? []).filter(Boolean).map((b, j) => (
                <div key={j} contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: '#444', paddingLeft: 10, marginTop: 2, lineHeight: 1.5 }}>• {b}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 3-column bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: 16 }}>
        {data.education.length > 0 && (
          <div>
            <SectionTitle>{L.edu}</SectionTitle>
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div contentEditable suppressContentEditableWarning style={{ fontWeight: 700, fontSize: 11 }}>{e.degree}{e.field ? ` — ${e.field}` : ''}</div>
                <div contentEditable suppressContentEditableWarning style={{ color: accent, fontSize: 10 }}>{e.school}</div>
                <div style={{ color: '#888', fontSize: 10 }}>{e.startDate}–{e.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <SectionTitle>{L.skills}</SectionTitle>
            {data.skills.map((s, i) => (
              <div key={i} style={{ fontSize: 11, marginBottom: 3 }}>• {s}</div>
            ))}
          </div>
        )}
        <div>
          {data.languages.length > 0 && (
            <>
              <SectionTitle>{L.langs}</SectionTitle>
              {data.languages.map((l, i) => (
                <div key={i} style={{ fontSize: 11, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700 }}>{l.name}</span><br />
                  <span style={{ color: '#777', fontSize: 10 }}>{l.level}</span>
                </div>
              ))}
            </>
          )}
          {data.certifications && data.certifications.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <SectionTitle>{L.certs}</SectionTitle>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ fontSize: 10, marginBottom: 5 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#777' }}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
