/**
 * DJTable — Scene 1
 *
 * bg-table.jpg (2000×1545) already contains the physical devices.
 * This component places SCREEN-CONTENT overlays at exact % positions
 * over those device screens, matched to revised-placement.jpg.
 *
 * Inner-container sizing mirrors background-size:cover so % positions
 * are stable across any viewport aspect ratio.
 *
 * Image coordinate system: 1999 × 1545 px
 * Elements below are measured as % of that coordinate space.
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import DJTableIPad from "./DJTableIPad"
import DJTablePolaroids from "./DJTablePolaroids"

const API_URL  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const IMG_W    = 1999
const IMG_H    = 1545
const IMG_RATIO = IMG_W / IMG_H   // ≈ 1.2944

interface Settings {
  phone_video_url: string
  soundcloud_url:  string
  twitch_channel:  string
  live_mode:       boolean
  polaroid_photos: string[]
}

const DEFAULT_SC =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/3207" +
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
    /* ── Outer viewport clip ────────────────────────────────────────────── */
    <div style={outerStyle}>

      {/* ── Inner container — mirrors background-size:cover geometry ────── */}
      <div style={innerStyle(IMG_RATIO)}>

        {/* Background photo */}
        <div style={bgStyle} />

        {/* ── FLYER TAB — upper left ────────────────────────────────────── */}
        {/* Sits over the small photo/tab area already in the image         */}
        <Link href="/flyers" style={abs(0, 0, 14, 20)} tabIndex={0} aria-label="View flyers">
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
            padding: "6% 8%",
            cursor: "pointer",
          }} />
        </Link>

        {/* ── PHONE SCREEN — left, angled ───────────────────────────────── */}
        {/* Covers the phone screen in bg-table.jpg                         */}
        <div style={{ ...abs(3, 23, 9, 25), transform: "rotate(-8deg)", overflow: "hidden", borderRadius: "4%" }}>
          {settings.phone_video_url ? (
            <video
              src={settings.phone_video_url}
              autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#0a0a0a" }} />
          )}
        </div>

        {/* ── iPAD SCREEN — upper center ────────────────────────────────── */}
        {/* Covers the iPad/tablet screen in bg-table.jpg                   */}
        <div style={{ ...abs(18, 10.5, 24, 27), transform: "rotate(1.5deg)", overflow: "hidden", borderRadius: "1.5%" }}>
          <DJTableIPad />
        </div>

        {/* ── CONTROLLER SCREEN — center ────────────────────────────────── */}
        {/* Covers the built-in display on the Omnis-Duo                    */}
        <div style={{ ...abs(19, 53.5, 22, 13), overflow: "hidden", borderRadius: "2%" }}>
          <iframe
            src={embedUrl}
            width="100%" height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen"
            style={{ border: "none", display: "block" }}
            title={settings.live_mode ? "Live stream" : "SoundCloud"}
          />
        </div>

        {/* ── POLAROIDS — lower right ───────────────────────────────────── */}
        {/* Overlays on top of the polaroid frames already in bg-table.jpg  */}
        <div style={{ ...abs(70, 64, 20, 30), pointerEvents: "auto" }}>
          <DJTablePolaroids photos={settings.polaroid_photos} />
        </div>

      </div>
    </div>
  )
}

// ── Layout helpers ────────────────────────────────────────────────────────────

/**
 * abs(left%, top%, width%, height%) → absolute-positioned CSSProperties
 * All values are % of the inner container (= % of background image).
 */
function abs(
  left: number,
  top: number,
  width: number,
  height: number,
): React.CSSProperties {
  return {
    position: "absolute",
    left:   `${left}%`,
    top:    `${top}%`,
    width:  `${width}%`,
    height: `${height}%`,
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const outerStyle: React.CSSProperties = {
  position: "relative",
  width:    "100vw",
  height:   "100vh",
  overflow: "hidden",
  background: "#1a1008", // edge colour if letterboxing ever shows
}

/**
 * Inner container sized to match background-size:cover behaviour for IMG_RATIO.
 * max(100vw, 100vh*ratio)  ×  max(100vh, 100vw/ratio)
 * Centred in the outer viewport.
 */
function innerStyle(ratio: number): React.CSSProperties {
  return {
    position: "absolute",
    width:    `max(100vw, calc(100vh * ${ratio}))`,
    height:   `max(100vh, calc(100vw / ${ratio}))`,
    top:      "50%",
    left:     "50%",
    transform: "translate(-50%, -50%)",
  }
}

const bgStyle: React.CSSProperties = {
  position:           "absolute",
  inset:              0,
  backgroundImage:    "url('/bg-table.jpg')",
  backgroundSize:     "100% 100%",  // fill inner container exactly
  backgroundPosition: "center",
  backgroundRepeat:   "no-repeat",
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
