// A small CSS-only spinning indicator for inline use inside buttons and labels. Pure
// presentation (no hooks), so it renders fine in both server and client components.
export default function InlineSpinner({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <>
      <style>{`@keyframes cvpro-spin { to { transform: rotate(360deg); } }`}</style>
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          border: `2px solid ${color}40`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'cvpro-spin 0.6s linear infinite',
          flexShrink: 0,
        }}
      />
    </>
  )
}
