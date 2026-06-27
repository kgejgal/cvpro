import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CVPro.pl – Profesjonalne CV w języku polskim'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0d1c35 0%, #162d50 60%, #0d1c35 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(68,119,255,0.12)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -60, right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(112,85,255,0.1)', display: 'flex' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, marginBottom: 32 }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#4477FF', letterSpacing: '-3px' }}>CV</span>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#E2EEFF', letterSpacing: '-3px' }}>Pro</span>
          <span style={{ fontSize: 36, fontWeight: 500, color: '#6B84AA', marginLeft: 4 }}>.pl</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 38, fontWeight: 700, color: '#E2EEFF', textAlign: 'center', maxWidth: 800, lineHeight: 1.25, marginBottom: 28 }}>
          Profesjonalne CV<br />w języku polskim
        </div>

        {/* Sub */}
        <div style={{ fontSize: 22, color: '#8ba3c4', textAlign: 'center', maxWidth: 700, lineHeight: 1.5 }}>
          16 szablonów · Analiza ATS · Jednorazowa płatność · BLIK
        </div>

        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #4477FF, #7055FF)' }} />
      </div>
    ),
    { ...size }
  )
}
