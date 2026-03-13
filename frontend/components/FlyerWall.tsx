import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// 1920×1080 canvas — all coordinates in this pixel space
const W = 1920
const H = 1080

// ── Exact positions from layout spec ──────────────────────────────────────────
const RETURN_BTN = { x: 33.6,  y: 931.8, w: 372.4, h: 129.8 }
const FLYER_ROW  = { y: 185,   w: 225,   h: 309 }
const FLYER_X    = [272.7, 560.3, 848, 1135.8, 1423.5]
const SLOT_ROT   = [-2, 1, -1, 2, -1.5]  // slight rotations for realism

interface Flyer {
  _id: string
  url: string
  title: string
}

export default function FlyerWall() {
  const [flyers, setFlyers]   = useState<Flyer[]>([])
  const [lightbox, setLightbox] = useState<Flyer | null>(null)
  const [scale, setScale]     = useState(1)
  const [mobile, setMobile]   = useState(false)

  useEffect(() => {
    const calc = () => {
      setMobile(window.innerWidth < 768)
      setScale(window.innerWidth / W)
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/media/flyers`)
      .then(r => setFlyers(r.data))
      .catch(() => {})
  }, [])

  const slots: (Flyer | null)[] = Array.from({ length: 5 }, (_, i) => flyers[i] ?? null)

  if (mobile) return <MobileWall flyers={flyers} />

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#1a1210" }}>
      {/* Fixed 1920×1080 canvas */}
      <div style={{
        position: "absolute",
        width: W, height: H,
        left: "50%", top: "50%",
        transformOrigin: "50% 50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}>
        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/bg-wall.jpg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }} />

        {/* ── 5 FLYER SLOTS ───────────────────────────────────────── */}
        {slots.map((flyer, i) => (
          <FlyerSlot
            key={i}
            flyer={flyer}
            x={FLYER_X[i]}
            y={FLYER_ROW.y}
            w={FLYER_ROW.w}
            h={FLYER_ROW.h}
            rot={SLOT_ROT[i] || 0}
            onClick={flyer ? () => setLightbox(flyer) : undefined}
          />
        ))}

        {/* ── RETURN BUTTON ─────────────────────────────────────────
         *  x=33.6  y=931.8  w=372.4  h=129.8  rot=0°
         * ─────────────────────────────────────────────────────────── */}
        <Link href="/" style={{
          position: "absolute",
          left: RETURN_BTN.x, top: RETURN_BTN.y,
          width: RETURN_BTN.w, height: RETURN_BTN.h,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          color: "#e8d4a0", textDecoration: "none",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, letterSpacing: 3,
          background: "rgba(0,0,0,0.45)",
          border: "2px solid rgba(232,212,160,0.35)",
          borderRadius: 6,
          zIndex: 20,
        }}>
          ← BACK HOME
        </Link>

      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out",
        }} onClick={() => setLightbox(null)}>
          <div style={{ position: "relative", padding: 24, cursor: "default", maxWidth: "90vw" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{
              position: "absolute", top: 0, right: 0,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16,
            }}>✕</button>
            <img src={lightbox.url} alt={lightbox.title || "Event flyer"}
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", display: "block", borderRadius: 4 }} />
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

// ── FlyerSlot ─────────────────────────────────────────────────────────────────
interface FlyerSlotProps {
  flyer: Flyer | null
  x: number; y: number; w: number; h: number; rot: number
  onClick?: () => void
}
function FlyerSlot({ flyer, x, y, w, h, rot, onClick }: FlyerSlotProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h,
        transform: `rotate(${rot}deg)${hovered && flyer ? " scale(1.05)" : ""}`,
        transformOrigin: "center bottom",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: flyer ? "pointer" : "default",
        background: flyer ? "transparent" : "rgba(255,255,255,0.04)",
        border: flyer ? "none" : "2px dashed rgba(255,255,255,0.1)",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: flyer
          ? hovered ? "0 16px 48px rgba(0,0,0,0.9)" : "0 8px 24px rgba(0,0,0,0.7)"
          : "none",
        zIndex: hovered ? 15 : 5,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {flyer ? (
        <img src={flyer.url} alt={flyer.title || "Event flyer"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, color: "rgba(255,255,255,0.08)",
        }}>+</div>
      )}
    </div>
  )
}

// ── Mobile fallback ───────────────────────────────────────────────────────────
function MobileWall({ flyers }: { flyers: Flyer[] }) {
  const [lightbox, setLightbox] = useState<Flyer | null>(null)
  return (
    <div style={{
      minHeight: "100vh", background: "#1a1210",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 16px 40px", gap: 16,
    }}>
      <Link href="/" style={{
        alignSelf: "flex-start", color: "#e8d4a0", textDecoration: "none",
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
        padding: "8px 16px", border: "1px solid rgba(232,212,160,0.3)",
        borderRadius: 4, background: "rgba(0,0,0,0.4)",
      }}>← BACK HOME</Link>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", width: "100%" }}>
        {Array.from({ length: 5 }, (_, i) => flyers[i] ?? null).map((flyer, i) => (
          <div key={i} style={{
            width: "calc(50% - 6px)", maxWidth: 180,
            aspectRatio: "3/4", borderRadius: 4, overflow: "hidden",
            background: flyer ? "transparent" : "rgba(255,255,255,0.05)",
            border: flyer ? "none" : "2px dashed rgba(255,255,255,0.1)",
            cursor: flyer ? "pointer" : "default",
          }} onClick={() => flyer && setLightbox(flyer)}>
            {flyer ? (
              <img src={flyer.url} alt={flyer.title || "Flyer"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.1)", fontSize: 24 }}>+</div>
            )}
          </div>
        ))}
      </div>
      {lightbox && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt={lightbox.title || "Flyer"}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
        </div>
      )}
    </div>
  )
}
