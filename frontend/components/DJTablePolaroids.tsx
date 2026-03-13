import { useState, useEffect, useRef } from "react"

interface Props {
  photos: string[]
}

const ROTATIONS = [-4, 3, -2, 5, -3]
const OFFSETS   = [
  { top: 0,  left: 0  },
  { top: 8,  left: 12 },
  { top: 4,  left: -8 },
  { top: 14, left: 6  },
  { top: 2,  left: -4 },
]

export default function DJTablePolaroids({ photos }: Props) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading]   = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const count = photos.length

  const advance = (next?: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(next !== undefined ? next : (c) => (c + 1) % count)
      setFading(false)
    }, 350)
  }

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (count < 2) return
    timerRef.current = setInterval(() => advance(), 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [count])

  const handleClick = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    advance()
    // Restart auto-advance after manual click
    timerRef.current = setInterval(() => advance(), 4000)
  }

  if (count === 0) return <PolaroidPlaceholder />

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", cursor: "pointer" }}
      onClick={handleClick}
      title="Click to see next photo"
    >
      {/* Stack of polaroids (decorative — showing slight offsets) */}
      {photos.slice(0, Math.min(3, count)).map((_, i) => {
        const isTop = i === 0
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg) translate(${OFFSETS[i].left}px, ${OFFSETS[i].top}px)`,
              zIndex: isTop ? 10 : 5 - i,
            }}
          >
            <PolaroidFrame opacity={isTop ? 1 : 0.6} />
          </div>
        )
      })}

      {/* Active photo on top */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.35s ease",
          transform: `rotate(${ROTATIONS[0]}deg)`,
        }}
      >
        <PolaroidFrame photo={photos[current]} />
      </div>
    </div>
  )
}

function PolaroidFrame({ photo, opacity = 1 }: { photo?: string; opacity?: number }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#f8f5ee",
      borderRadius: 3,
      boxShadow: "2px 4px 12px rgba(0,0,0,0.4)",
      padding: "8% 8% 22% 8%",
      boxSizing: "border-box" as const,
      opacity,
      display: "flex",
      flexDirection: "column" as const,
    }}>
      <div style={{
        flex: 1,
        background: photo ? "transparent" : "#ddd",
        overflow: "hidden",
        position: "relative",
      }}>
        {photo && (
          <img
            src={photo}
            alt="polaroid"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
    </div>
  )
}

function PolaroidPlaceholder() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#f8f5ee",
      borderRadius: 3,
      boxShadow: "2px 4px 12px rgba(0,0,0,0.4)",
      padding: "8% 8% 22% 8%",
      boxSizing: "border-box",
      transform: "rotate(-4deg)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ flex: 1, background: "#e8e4dd" }} />
    </div>
  )
}
