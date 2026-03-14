/**
 * DJTable — Scene 1
 *
 * Fixed 1920×1080 canvas. User-specified coordinates + position tweaks:
 *
 *   Flyer page button   : 220.4,  31.7, 353.7, 123.3,    0°
 *   Phone media player  : 745.4,  92.7, 335.9, 157.1,  5.2°
 *   Polaroid stack      : 1595.1, 74.2, 210.7, 216.7, -17°
 *   SoundCloud player   : 434.7, 381.5, 332.4, 195.6,    0°
 *   iPad / booking      : 1290,  369.3,   449, 596.2, -3.6°
 */
import { useState, useEffect } from "react"
import Link from "next/link"
import DJTableIPad from "./DJTableIPad"
import DJTablePolaroids from "./DJTablePolaroids"

const API_URL  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const CANVAS_W = 1920
const CANVAS_H = 1080

const DEFAULT_SC =
  "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kineticnola" +
  "&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false" +
  "&show_user=false&show_reposts=false&visual=true"

interface Settings {
  phone_video_url: string
  soundcloud_url:  string
  twitch_channel:  string
  live_mode:       boolean
  polaroid_photos: string[]
}

export default function DJTable() {
  const [settings, setSettings] = useState<Settings>({
    phone_video_url: "",
    soundcloud_url:  DEFAULT_SC,
    twitch_channel:  "",
    live_mode:       false,
    polaroid_photos: [],
  })
  const [scale, setScale] = useState(1)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const calc = () => {
      setScale(Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H))
      setMobile(window.innerWidth < 900)
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
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
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#14100a" }}>
      <div style={{
        position:        "absolute",
        width:           CANVAS_W,
        height:          CANVAS_H,
        top:             "50%",
        left:            "50%",
        transform:       `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          position:         "absolute",
          inset:            0,
          backgroundImage:  "url('/bg-table2.jpg')",
          backgroundSize:   "100% 100%",
          backgroundRepeat: "no-repeat",
          zIndex:           1,
        }} />

        {/* FLYER PAGE BUTTON: 220.4, 31.7, 353.7, 123.3, 0° */}
        <Link href="/flyers"
          style={{ ...px(220.4, 31.7, 353.7, 123.3), zIndex: 30, display: "block" }}
          aria-label="View flyers"
        />

        {/* PHONE: 745.4, 92.7 */}
        <div style={{ ...px(745.4, 92.7, 335.9, 157.1), transform: "rotate(5.2deg)", overflow: "hidden", borderRadius: "6%", zIndex: 10 }}>
          {settings.phone_video_url ? (
            <video src={settings.phone_video_url} autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#111" }} />
          )}
        </div>

        {/* POLAROIDS: 1595.1, 74.2 */}
        <div style={{ ...px(1595.1, 74.2, 210.7, 216.7), transform: "rotate(-17deg)", zIndex: 10 }}>
          <DJTablePolaroids photos={settings.polaroid_photos} />
        </div>

        {/* SOUNDCLOUD: 434.7, 381.5 */}
        <div style={{ ...px(434.7, 381.5, 332.4, 195.6), overflow: "hidden", borderRadius: "2%", zIndex: 10 }}>
          <iframe src={embedUrl} width="100%" height="100%" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen"
            style={{ border: "none", display: "block" }}
            title={settings.live_mode ? "Live stream" : "SoundCloud"} />
        </div>

        {/* iPAD: 1290, 369.3 */}
        <div style={{ ...px(1290, 369.3, 449, 596.2), transform: "rotate(-3.6deg)", overflow: "hidden", borderRadius: "2%", zIndex: 10 }}>
          <DJTableIPad />
        </div>

      </div>
    </div>
  )
}

function px(x: number, y: number, w: number, h: number): React.CSSProperties {
  return { position: "absolute", left: x, top: y, width: w, height: h }
}

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
        <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allow="autoplay"
          title="Player" style={{ border: "none" }} />
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
          <video src={settings.phone_video_url} autoPlay muted loop playsInline
            style={{ width: "100%", display: "block" }} />
        </div>
      )}
    </div>
  )
}
