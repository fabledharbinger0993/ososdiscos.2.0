import { useState, useEffect } from "react"
import Link from "next/link"
import DJTableIPad from "./DJTableIPad"
import DJTablePolaroids from "./DJTablePolaroids"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Settings {
  phone_video_url: string
  soundcloud_url: string
  twitch_channel: string
  live_mode: boolean
  polaroid_photos: string[]
}

const DEFAULT_SC = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/3207&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=true"

export default function DJTable() {
  const [settings, setSettings] = useState<Settings>({
    phone_video_url: "",
    soundcloud_url: DEFAULT_SC,
    twitch_channel: "",
    live_mode: false,
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
    ? `https://player.twitch.tv/?channel=${settings.twitch_channel}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}&muted=false`
    : (settings.soundcloud_url || DEFAULT_SC)

  if (mobile) return <MobileScene settings={settings} embedUrl={embedUrl} />

  return (
    <div style={sceneStyle}>
      {/* Wood table background */}
      <div style={bgStyle} />

      {/* ── FLYER TAB — upper left ── */}
      <Link href="/flyers" style={flyerTabStyle}>
        <span style={{ fontSize: "clamp(8px,1.1vw,13px)", fontWeight: 900, letterSpacing: 1, lineHeight: 1.2 }}>
          FLYERS
        </span>
        <span style={{ fontSize: "clamp(7px,0.9vw,11px)", letterSpacing: 0.5, lineHeight: 1.2 }}>
          THIS WAY!
        </span>
        <span style={{ fontSize: "clamp(10px,1.4vw,16px)" }}>→</span>
      </Link>

      {/* ── PHONE — left, angled ── */}
      <div style={phoneWrapStyle}>
        <div style={phoneFrameStyle}>
          <div style={phoneScreenStyle}>
            {settings.phone_video_url ? (
              <video
                src={settings.phone_video_url}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid #444", marginLeft: 2 }} />
                </div>
              </div>
            )}
          </div>
          {/* Phone camera notch */}
          <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: "30%", height: 6, background: "#111", borderRadius: 3 }} />
          {/* Home indicator */}
          <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", width: "40%", height: 3, background: "#333", borderRadius: 2 }} />
        </div>
      </div>

      {/* ── iPAD — upper center ── */}
      <div style={ipadWrapStyle}>
        <DJTableIPad />
      </div>

      {/* ── LOGO STICKER — upper right ── */}
      <div style={logoStickerStyle}>
        <img
          src="/osos-sticker.png"
          alt="Osos Discos"
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,0,0,0.4))" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
        />
        {/* Fallback text sticker if image missing */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(10px,1.6vw,18px)",
          color: "#d4af37",
          textShadow: "0 0 8px rgba(212,175,55,0.6)",
          letterSpacing: 2,
          pointerEvents: "none",
        }}>
        </div>
      </div>

      {/* ── DJ CONTROLLER — center dominant ── */}
      <div style={controllerWrapStyle}>
        <ControllerShell>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ border: "none", display: "block" }}
            title={settings.live_mode ? "Live stream" : "SoundCloud player"}
          />
        </ControllerShell>
      </div>

      {/* ── POLAROIDS — lower right ── */}
      <div style={polaroidWrapStyle}>
        <DJTablePolaroids photos={settings.polaroid_photos} />
      </div>
    </div>
  )
}

// ── Controller shell ──────────────────────────────────────────────────────────
function ControllerShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#1e2433",
      borderRadius: "clamp(8px,1.2vw,16px)",
      border: "2px solid #2a3044",
      boxShadow: "0 8px 32px rgba(0,0,0,0.7), inset 0 0 0 1px #333",
      display: "flex",
      flexDirection: "column",
      padding: "clamp(8px,1.5vw,20px)",
      gap: "clamp(4px,0.8vw,10px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Brand label */}
      <div style={{
        fontSize: "clamp(6px,0.8vw,9px)",
        color: "#555",
        letterSpacing: 3,
        fontWeight: 700,
        textTransform: "uppercase" as const,
        alignSelf: "flex-start",
      }}>OMNIS-DUO</div>

      {/* Screen area — where embed lives */}
      <div style={{
        flex: 1,
        background: "#000",
        borderRadius: "clamp(3px,0.5vw,6px)",
        overflow: "hidden",
        border: "1px solid #333",
        minHeight: 0,
      }}>
        {children}
      </div>

      {/* Bottom knob row */}
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(4px,1vw,12px)", flexShrink: 0 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: "clamp(10px,1.5vw,18px)",
            height: "clamp(10px,1.5vw,18px)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #4a4a5a, #1a1a2a)",
            border: "1px solid #333",
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Mobile scene ──────────────────────────────────────────────────────────────
function MobileScene({ settings, embedUrl }: { settings: Settings; embedUrl: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#1a120a", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px 40px", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 480 }}>
        <img src="/osos-sticker.png" alt="Osos Discos" style={{ height: 60, objectFit: "contain" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
        <Link href="/flyers" style={{
          padding: "8px 16px",
          background: "#cc2478",
          color: "#fff",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          textDecoration: "none",
          letterSpacing: 1,
        }}>FLYERS →</Link>
      </div>

      {/* SoundCloud / Twitch */}
      <div style={{ width: "100%", maxWidth: 480, height: 160, borderRadius: 12, overflow: "hidden", background: "#000" }}>
        <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allow="autoplay" title="Player" style={{ border: "none" }} />
      </div>

      {/* Calendar / iPad */}
      <div style={{ width: "100%", maxWidth: 480, height: 360, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
        <DJTableIPad />
      </div>

      {/* Polaroids */}
      {settings.polaroid_photos.length > 0 && (
        <div style={{ width: 180, height: 220, position: "relative", flexShrink: 0 }}>
          <DJTablePolaroids photos={settings.polaroid_photos} />
        </div>
      )}

      {/* Phone video */}
      {settings.phone_video_url && (
        <div style={{ width: "100%", maxWidth: 480, borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <video src={settings.phone_video_url} autoPlay muted loop playsInline style={{ width: "100%", display: "block" }} />
        </div>
      )}
    </div>
  )
}

// ── Desktop position styles ───────────────────────────────────────────────────

const sceneStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
}

const bgStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "url('/bg-table.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  // CSS fallback: dark wood grain gradient
  background: `
    url('/bg-table.jpg') center/cover no-repeat,
    repeating-linear-gradient(
      92deg,
      rgba(255,255,255,0.015) 0px,
      rgba(255,255,255,0.015) 1px,
      transparent 1px,
      transparent 40px
    ),
    repeating-linear-gradient(
      2deg,
      rgba(0,0,0,0.08) 0px,
      rgba(0,0,0,0.08) 1px,
      transparent 1px,
      transparent 80px
    ),
    linear-gradient(160deg, #3d2612 0%, #2a1a0a 40%, #1e1308 100%)
  `,
}

const flyerTabStyle: React.CSSProperties = {
  position: "absolute",
  top: "2%",
  left: "11%",
  zIndex: 30,
  background: "#ffe135",
  border: "2px solid #e6c200",
  borderRadius: "4px 4px 0 0",
  padding: "6px 12px 10px",
  boxShadow: "2px 4px 8px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1,
  transform: "rotate(-2deg)",
  cursor: "pointer",
  textDecoration: "none",
  color: "#1a1a00",
  transition: "transform 0.15s",
}

const phoneWrapStyle: React.CSSProperties = {
  position: "absolute",
  left: "2.5%",
  top: "7%",
  width: "clamp(80px,11vw,140px)",
  aspectRatio: "9/19",
  transform: "rotate(-15deg)",
  zIndex: 20,
}

const phoneFrameStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#111",
  borderRadius: "clamp(8px,1.5vw,18px)",
  border: "3px solid #222",
  boxShadow: "0 6px 24px rgba(0,0,0,0.7), inset 0 0 0 1px #333",
  position: "relative",
  overflow: "hidden",
  padding: "10% 4% 12%",
  boxSizing: "border-box",
}

const phoneScreenStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#000",
  borderRadius: "clamp(4px,0.8vw,8px)",
  overflow: "hidden",
  position: "relative",
}

const ipadWrapStyle: React.CSSProperties = {
  position: "absolute",
  left: "29%",
  top: "1%",
  width: "clamp(200px,34vw,460px)",
  aspectRatio: "4/3",
  zIndex: 20,
  transform: "rotate(1deg)",
}

const logoStickerStyle: React.CSSProperties = {
  position: "absolute",
  right: "2%",
  top: "2%",
  width: "clamp(100px,18vw,240px)",
  aspectRatio: "1/1",
  zIndex: 20,
  pointerEvents: "none",
}

const controllerWrapStyle: React.CSSProperties = {
  position: "absolute",
  left: "4%",
  top: "40%",
  width: "clamp(300px,57vw,780px)",
  height: "clamp(180px,35vh,480px)",
  zIndex: 15,
}

const polaroidWrapStyle: React.CSSProperties = {
  position: "absolute",
  right: "2%",
  bottom: "4%",
  width: "clamp(80px,14vw,180px)",
  height: "clamp(100px,18vw,220px)",
  zIndex: 20,
}
