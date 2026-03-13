import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Flyer {
  _id: string
  url: string
  title: string
}

const SLOT_ROTATIONS = [-2, 1, -1, 2, -1.5]
const MAX_SLOTS = 5

export default function FlyerWall() {
  const [flyers, setFlyers] = useState<Flyer[]>([])
  const [lightbox, setLightbox] = useState<Flyer | null>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/media/flyers`)
      .then(r => setFlyers(r.data))
      .catch(() => {})
  }, [])

  // Build 5 slots — fill with flyers, leave empties
  const slots: (Flyer | null)[] = Array.from({ length: MAX_SLOTS }, (_, i) => flyers[i] ?? null)

  const openLightbox = (flyer: Flyer) => setLightbox(flyer)
  const closeLightbox = () => setLightbox(null)

  return (
    <div style={sceneStyle}>
      {/* Brick wall background */}
      <div style={bgStyle} />

      {/* Corner vignette */}
      <div style={vignetteStyle} />

      {/* ── WALL AREA ── */}
      <div style={wallAreaStyle(mobile)}>
        {/* Spotlights bar */}
        <div style={spotlightBarStyle(mobile)}>
          {[...Array(MAX_SLOTS)].map((_, i) => (
            <SpotlightClip key={i} />
          ))}
        </div>

        {/* Poster slots */}
        <div style={posterRowStyle(mobile)}>
          {slots.map((flyer, i) => (
            <PosterSlot
              key={i}
              flyer={flyer}
              rotation={SLOT_ROTATIONS[i] || 0}
              onClick={flyer ? () => openLightbox(flyer) : undefined}
              mobile={mobile}
            />
          ))}
        </div>
      </div>

      {/* ── COUNTERTOP ── */}
      <div style={countertopStyle}>
        {/* Back home button */}
        <Link href="/" style={backHomeStyle}>
          <span style={{ fontSize: "clamp(12px,2vw,18px)" }}>←</span>
          <span style={{ fontSize: "clamp(10px,1.4vw,14px)", fontWeight: 900, letterSpacing: 1 }}>BACK HOME</span>
        </Link>

        {/* Headphones — right side */}
        <div style={headphonesStyle}>
          <img
            src="/headphones.png"
            alt="headphones"
            style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.85 }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
          />
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div style={lightboxOverlayStyle} onClick={closeLightbox}>
          <div style={lightboxFrameStyle} onClick={e => e.stopPropagation()}>
            <button style={lightboxCloseStyle} onClick={closeLightbox}>✕</button>
            <img
              src={lightbox.url}
              alt={lightbox.title || "Event flyer"}
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", display: "block", borderRadius: 4 }}
            />
            {lightbox.title && (
              <p style={{ color: "#fff", textAlign: "center", marginTop: 12, fontSize: 14, opacity: 0.8 }}>
                {lightbox.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SpotlightClip() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0,
      flex: 1,
    }}>
      {/* Mounting bracket */}
      <div style={{
        width: "clamp(4px,0.6vw,8px)",
        height: "clamp(6px,1vw,14px)",
        background: "#2a2a2a",
        borderRadius: 2,
      }} />
      {/* Clip body */}
      <div style={{
        width: "clamp(18px,2.5vw,32px)",
        height: "clamp(12px,1.6vw,20px)",
        background: "linear-gradient(160deg, #3a3a3a, #1a1a1a)",
        borderRadius: "50% 50% 4px 4px / 40% 40% 4px 4px",
        border: "1px solid #444",
        boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
      }} />
    </div>
  )
}

interface PosterSlotProps {
  flyer: Flyer | null
  rotation: number
  onClick?: () => void
  mobile: boolean
}

function PosterSlot({ flyer, rotation, onClick, mobile }: PosterSlotProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        flex: 1,
        aspectRatio: "3/4",
        maxWidth: mobile ? 120 : "none",
        background: flyer ? "transparent" : "rgba(255,255,255,0.04)",
        border: flyer ? "none" : "2px dashed rgba(255,255,255,0.1)",
        borderRadius: 3,
        overflow: "hidden",
        transform: `rotate(${rotation}deg) ${hovered && flyer ? "scale(1.04)" : ""}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: flyer ? "pointer" : "default",
        boxShadow: flyer
          ? hovered
            ? "0 12px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.1)"
            : "0 6px 20px rgba(0,0,0,0.6)"
          : "none",
        position: "relative",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {flyer ? (
        <img
          src={flyer.url}
          alt={flyer.title || "Event flyer"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(16px,2vw,24px)",
          color: "rgba(255,255,255,0.1)",
        }}>+</div>
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const sceneStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}

const bgStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: `
    url('/bg-wall.jpg') center/cover no-repeat,
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 28px,
      rgba(0,0,0,0.15) 28px,
      rgba(0,0,0,0.15) 30px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 56px,
      rgba(0,0,0,0.08) 56px,
      rgba(0,0,0,0.08) 58px
    ),
    linear-gradient(180deg, #2a2420 0%, #1e1c1a 60%, #3d2e20 100%)
  `,
  zIndex: 0,
}

const vignetteStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.7) 100%)",
  pointerEvents: "none",
  zIndex: 1,
}

const wallAreaStyle = (mobile: boolean): React.CSSProperties => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: mobile ? "0 12px" : "0 clamp(16px,4vw,60px)",
  paddingTop: "clamp(8px,2vh,24px)",
  position: "relative",
  zIndex: 2,
})

const spotlightBarStyle = (mobile: boolean): React.CSSProperties => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "flex-end",
  padding: "0 clamp(10px,3vw,40px)",
  marginBottom: mobile ? 4 : "clamp(4px,0.8vh,10px)",
})

const posterRowStyle = (mobile: boolean): React.CSSProperties => ({
  display: "flex",
  gap: mobile ? "clamp(6px,2vw,10px)" : "clamp(8px,1.5vw,20px)",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: "0 clamp(4px,2vw,20px)",
  marginBottom: "clamp(0px,1vh,8px)",
})

const countertopStyle: React.CSSProperties = {
  height: "clamp(80px,20vh,200px)",
  background: `
    url('/bg-counter.jpg') center/cover no-repeat,
    linear-gradient(180deg, #4a3520 0%, #3a2810 50%, #2a1e0a 100%)
  `,
  borderTop: "3px solid #5a3d1e",
  boxShadow: "0 -8px 40px rgba(0,0,0,0.8)",
  position: "relative",
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  padding: "0 clamp(16px,3vw,40px)",
}

const backHomeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "#e8d4a0",
  textDecoration: "none",
  fontFamily: "'Bebas Neue', sans-serif",
  letterSpacing: 2,
  padding: "8px 16px",
  border: "1px solid rgba(232,212,160,0.3)",
  borderRadius: 4,
  background: "rgba(0,0,0,0.3)",
  transition: "all 0.2s",
  flexShrink: 0,
}

const headphonesStyle: React.CSSProperties = {
  position: "absolute",
  right: "clamp(16px,4vw,60px)",
  bottom: 0,
  width: "clamp(60px,12vw,160px)",
  height: "clamp(60px,15vh,160px)",
  pointerEvents: "none",
}

const lightboxOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.92)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "zoom-out",
}

const lightboxFrameStyle: React.CSSProperties = {
  position: "relative",
  padding: 24,
  cursor: "default",
  maxWidth: "90vw",
}

const lightboxCloseStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  width: 36,
  height: 36,
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}
