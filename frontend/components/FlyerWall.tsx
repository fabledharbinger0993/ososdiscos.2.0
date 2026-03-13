/**
 * FlyerWall — Flyer page
 *
 * Fixed 1920×1080 design canvas scaled via CSS transform to fit the viewport.
 *
 * Coordinates (x, y, w, h) in 1920×1080 pixel space:
 *   Return button : 33.6,   931.8, 372.4, 129.8
 *   Flyer slots   : y=185, w=225, h=309
 *     Slot 1 x : 272.7
 *     Slot 2 x : 560.3
 *     Slot 3 x : 848
 *     Slot 4 x : 1135.8
 *     Slot 5 x : 1423.5
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const CANVAS_W = 1920
const CANVAS_H = 1080

interface Flyer {
  _id: string
  url: string
  title: string
}

const FLYER_X   = [272.7, 560.3, 848, 1135.8, 1423.5]
const FLYER_Y   = 185
const FLYER_W   = 225
const FLYER_H   = 309
const MAX_SLOTS = 5
const SLOT_ROTATIONS = [-2, 1, -1, 2, -1.5]

export default function FlyerWall() {
  const [flyers,   setFlyers]   = useState<Flyer[]>([])
  const [lightbox, setLightbox] = useState<Flyer | null>(null)
  const [scale,    setScale]    = useState(1)

  useEffect(() => {
    const calc = () =>
      setScale(Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H))
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/media/flyers`)
      .then(r => setFlyers(r.data))
      .catch(() => {})
  }, [])

  const slots: (Flyer | null)[] = Array.from({ length: MAX_SLOTS }, (_, i) => flyers[i] ?? null)

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#1a1410" }}>
      {/* Fixed 1920×1080 canvas */}
      <div style={{
        position:        "absolute",
        width:           CANVAS_W,
        height:          CANVAS_H,
        top:             "50%",
        left:            "50%",
        transform:       `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: "center center",
      }}>

        {/* ── BACKGROUND ── */}
        <div style={{
          position: "absolute",
          inset:    0,
          background: `
            url('/bg-wall.jpg') center/cover no-repeat,
            repeating-linear-gradient(
              0deg,
              transparent, transparent 28px,
              rgba(0,0,0,0.15) 28px, rgba(0,0,0,0.15) 30px
            ),
            repeating-linear-gradient(
              90deg,
              transparent, transparent 56px,
              rgba(0,0,0,0.08) 56px, rgba(0,0,0,0.08) 58px
            ),
            linear-gradient(180deg, #2a2420 0%, #1e1c1a 60%, #3d2e20 100%)
          `,
          zIndex: 0,
        }} />

        {/* Corner vignette */}
        <div style={{
          position:      "absolute",
          inset:         0,
          background:    "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex:        1,
        }} />

        {/* ── SPOTLIGHT CLIPS (decorative, centered above each flyer) ── */}
        {FLYER_X.map((fx, i) => {
          const cx = fx + FLYER_W / 2
          return (
            <div key={i} style={{
              position: "absolute",
              left:     cx - 16,
              top:      80,
              width:    32,
              height:   100,
              zIndex:   2,
              display:  "flex",
              flexDirection: "column",
              alignItems:    "center",
              gap:       0,
            }}>
              {/* Mounting rod */}
              <div style={{
                width: 6, height: 30,
                background: "#2a2a2a",
                borderRadius: 2,
              }} />
              {/* Clip body */}
              <div style={{
                width:     32,
                height:    20,
                background: "linear-gradient(160deg, #3a3a3a, #1a1a1a)",
                borderRadius: "50% 50% 4px 4px / 40% 40% 4px 4px",
                border:    "1px solid #444",
                boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }} />
            </div>
          )
        })}

        {/* ── FLYER SLOTS — y=185, w=225, h=309 ── */}
        {slots.map((flyer, i) => (
          <PosterSlot
            key={i}
            flyer={flyer}
            x={FLYER_X[i]}
            y={FLYER_Y}
            w={FLYER_W}
            h={FLYER_H}
            rotation={SLOT_ROTATIONS[i] || 0}
            onClick={flyer ? () => setLightbox(flyer) : undefined}
          />
        ))}

        {/* ── COUNTERTOP BAND (visual) ── */}
        <div style={{
          position: "absolute",
          left: 0, top: 870,
          width: CANVAS_W, height: 210,
          background: `
            url('/bg-counter.jpg') center/cover no-repeat,
            linear-gradient(180deg, #4a3520 0%, #3a2810 50%, #2a1e0a 100%)
          `,
          borderTop: "3px solid #5a3d1e",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.8)",
          zIndex: 3,
        }} />

        {/* ── RETURN BUTTON — 33.6, 931.8, 372.4, 129.8, 0° ── */}
        <Link href="/" style={{
          ...px(33.6, 931.8, 372.4, 129.8),
          zIndex:         10,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            10,
          color:          "#e8d4a0",
          textDecoration: "none",
          fontFamily:     "'Bebas Neue', sans-serif",
          letterSpacing:  3,
          fontSize:       36,
          border:         "2px solid rgba(232,212,160,0.4)",
          borderRadius:   6,
          background:     "rgba(0,0,0,0.35)",
        }}>
          <span style={{ fontSize: 44 }}>←</span>
          <span>BACK HOME</span>
        </Link>

      </div>

      {/* ── LIGHTBOX (fixed overlay, outside canvas) ── */}
      {lightbox && (
        <div
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(0,0,0,0.92)",
            zIndex:         1000,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            cursor:         "zoom-out",
          }}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{ position: "relative", padding: 24, cursor: "default", maxWidth: "90vw" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position:     "absolute",
                top:          0,
                right:        0,
                background:   "rgba(255,255,255,0.1)",
                border:       "1px solid rgba(255,255,255,0.2)",
                color:        "#fff",
                width:        36,
                height:       36,
                borderRadius: "50%",
                cursor:       "pointer",
                fontSize:     16,
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
              }}
              onClick={() => setLightbox(null)}
            >✕</button>
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

interface PosterSlotProps {
  flyer:    Flyer | null
  x:        number
  y:        number
  w:        number
  h:        number
  rotation: number
  onClick?: () => void
}

function PosterSlot({ flyer, x, y, w, h, rotation, onClick }: PosterSlotProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position:   "absolute",
        left:       x,
        top:        y,
        width:      w,
        height:     h,
        background: flyer ? "transparent" : "rgba(255,255,255,0.04)",
        border:     flyer ? "none" : "2px dashed rgba(255,255,255,0.1)",
        borderRadius: 3,
        overflow:   "hidden",
        transform:  `rotate(${rotation}deg)${hovered && flyer ? " scale(1.04)" : ""}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor:     flyer ? "pointer" : "default",
        boxShadow:  flyer
          ? hovered
            ? "0 12px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.1)"
            : "0 6px 20px rgba(0,0,0,0.6)"
          : "none",
        zIndex: 4,
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
          width:          "100%",
          height:         "100%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       40,
          color:          "rgba(255,255,255,0.1)",
        }}>+</div>
      )}
    </div>
  )
}

// ── Helper ─────────────────────────────────────────────────────────────────────

function px(x: number, y: number, w: number, h: number): React.CSSProperties {
  return { position: "absolute", left: x, top: y, width: w, height: h }
}
