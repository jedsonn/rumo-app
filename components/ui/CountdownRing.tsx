'use client'

// CountdownRing - visual timer for Done delay (matches template EXACTLY)
export function CountdownRing({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} className="absolute -top-1 -right-1">
      <circle cx={size/2} cy={size/2} r="7" fill="none" stroke="#e2e8f0" strokeWidth="2" />
      <circle
        cx={size/2}
        cy={size/2}
        r="7"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeDasharray="44"
        strokeDashoffset="0"
        className="countdown-ring"
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
    </svg>
  )
}
