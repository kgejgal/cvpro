export default function DashboardLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1c35', padding: '80px 5%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ height: 32, width: 200, background: '#1a3060', borderRadius: 8, marginBottom: 32, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: '#0f2040', borderRadius: 12, padding: 24, height: 180, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
