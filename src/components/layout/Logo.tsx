type Props = { dark?: boolean; size?: number }

/* Aproximação em SVG/texto da logo; trocar pelo arquivo oficial em alta resolução quando disponível. */
export function Logo({ dark = false, size = 28 }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size * 1.3} viewBox="0 0 28 36" aria-hidden="true">
        <rect x="6" y="1" width="16" height="34" rx="4" fill="none" stroke={dark ? '#0d1b40' : '#1067e8'} strokeWidth="3" />
        <path d="M0 14h16l-4-4m4 4-4 4" fill="none" stroke="#1067e8" strokeWidth="3" strokeLinecap="round" />
        <path d="M28 24H12l4-4m-4 4 4 4" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: size * 0.85, fontWeight: 800, letterSpacing: -0.5 }}>
        <span style={{ color: dark ? '#0d1b40' : '#fff' }}>Fone</span>
        <span style={{ color: '#1067e8' }}>Flex</span>
      </span>
    </div>
  )
}
