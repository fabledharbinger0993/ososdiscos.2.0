/**
 * DJTable — Scene 1
 *
 * bg-table.jpg (2000×1545) contains all physical device frames.
 * Overlays are screen-content only, positioned at measured % coordinates.
 *
 * Coordinate reference: 2000×1545 image pixel space.
 * All abs() values measured directly from bg-table.jpg.
 *
 * SCALE (0.88) pulls the bird's-eye view back so the scene
 * breathes within the viewport instead of edge-to-edge.
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import DJTableIPad from "./DJTableIPad"
import DJTablePolaroids from "./DJTablePolaroids"

const API_URL   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const IMG_RATIO = 2000 / 1545   // ≈ 1.2944
const SCALE     = 0.88           // pull-back factor — scene breathes in viewport

interface Settings {
  phone_video_url: string
  soundcloud_url:  string
  twitch_channel:  string
  live_mode:       boolean
  polaroid_photos: string[]
}

const DEFAULT_SC =
  "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kineticnola" +
  "&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false" +
  "&show_user=false&show_reposts=false&visual=true"

export default function DJTable() {
  const [settings, setSettings] = useState<Settings>({
    phone_video_url: "",
    soundcloud_url:  DEFAULT_SC,
    twitch_channel:  "",
    live_mode:       false,
    polaroid_photos: [],
  })
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 900)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(r => r.json())
      .then(d => setSettings(s => ({ ...s, ...d })))
      .catch(() => {})
  }, [])

  const embedUrl = settings.live_mode && settings.twitch_channel
    ? `https://player.twitch.tv/?channel=${settings.twitch_channel}` +
      `&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&muted=false`
    : (settings.soundcloud_url || DEFAULT_SC)

  if (mobile) return <MobileScene settings={settings} embedUrl={embedUrl} />

  return (
    <div style={outerStyle}>
      {/* Inner container: mirrors background-size:cover geometry, then scaled back */}
      <div style={{
        position: "absolute",
        width:    `max(100vw, calc(100vh * ${IMG_RATIO}))`,
        height:   `max(100vh, calc(100vw / ${IMG_RATIO}))`,
        top:      "50%",
        left:     "50%",
        transform: `translate(-50%, -50%) scale(${SCALE})`,
      }}>

        {/* Background photo — fills inner container exactly */}
        <div style={{
          position:            "absolute",
          inset:               0,
          backgroundImage:     "url('/bg-table.jpg')",
          backgroundSize:      "100% 100%",
          backgroundRepeat:    "no-repeat",
        }} />

        {/*
         * ── OVERLAY POSITIONS (% of 2000×1545 image) ──────────────────────
         * Measured directly from bg-table.jpg.
         *
         * abs(left%, top%, width%, height%)
         */}

        {/* FLYER TAB — upper-left sticker area, transparent click zone */}
        <Link href="/flyers" style={{ ...abs(0, 0, 22, 20), zIndex: 30 }} aria-label="View flyers" />

        {/* PHONE SCREEN — left, angled ~-12° */}
        <div style={{ ...abs(8, 27, 11, 24), transform: "rotate(-12deg)", overflow: "hidden", borderRadius: "5%" }}>
          {settings.phone_video_url ? (
            <video
              src={settings.phone_video_url}
              autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#000" }} />
          )}
        </div>

        {/* iPAD SCREEN — upper center, slight +2° tilt */}
        <div style={{ ...abs(28, 3.5, 45, 42), transform: "rotate(2deg)", overflow: "hidden", borderRadius: "1%" }}>
          <DJTableIPad />
        </div>

        {/* CONTROLLER SCREEN — center of OMNIS-DUO */}
        <div style={{ ...abs(26, 47, 30, 16), overflow: "hidden", borderRadius: "1%" }}>
          <iframe
            src={embedUrl}
            width="100%" height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen"
            style={{ border: "none", display: "block" }}
            title={settings.live_mode ? "Live stream" : "SoundCloud"}
          />
        </div>

        {/* POLAROIDS — lower right stack */}
        <div style={{ ...abs(72, 66, 22, 33), zIndex: 10 }}>
          <DJTablePolaroids photos={settings.polaroid_photos} />
        </div>

      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** abs(left%, top%, width%, height%) → absolute CSSProperties */
function abs(l: number, t: number, w: number, h: number): React.CSSProperties {
  return {
    position: "absolute",
    left:     `${l}%`,
    top:      `${t}%`,
    width:    `${w}%`,
    height:   `${h}%`,
  }
}

const outerStyle: React.CSSProperties = {
  position:   "relative",
  width:      "100vw",
  height:     "100vh",
  overflow:   "hidden",
  background: "#14100a", // dark surround visible when SCALE < 1
}

// ── Mobile fallback ───────────────────────────────────────────────────────────
function MobileScene({ settings, embedUrl }: { settings: Settings; embedUrl: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#1a120a", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px 40px", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 480 }}>
        <img src="/osos-sticker.png" alt="Osos Discos" style={{ height: 56, objectFit: "contain" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
        <Link href="/flyers" style={{
          padding: "8px 16px", background: "#cc2478", color: "#fff",
          borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: 1,
        }}>FLYERS →</Link>
      </div>
      <div style={{ width: "100%", maxWidth: 480, height: 160, borderRadius: 12, overflow: "hidden", background: "#000" }}>
        <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allow="autoplay" title="Player" style={{ border: "none" }} />
      </div>
      <div style={{ width: "100%", maxWidth: 480, height: 380, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
        <DJTableIPad />
      </div>
      {settings.polaroid_photos.length > 0 && (
        <div style={{ width: 180, height: 220, position: "relative", flexShrink: 0 }}>
          <DJTablePolaroids photos={settings.polaroid_photos} />
        </div>
      )}
      {settings.phone_video_url && (
        <div style={{ width: "100%", maxWidth: 480, borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <video src={settings.phone_video_url} autoPlay muted loop playsInline style={{ width: "100%", display: "block" }} />
        </div>
      )}
    </div>
  )
}
