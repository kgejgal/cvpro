export default function CVEditorLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', display: 'flex', gap: 0 }}>
      <div style={{ width: 380, background: '#0a1628', borderRight: '1px solid #1a3060', padding: 24, flexShrink: 0 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ height: 56, background: '#1a3060', borderRadius: 8, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 595, height: 842, background: '#fff', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
