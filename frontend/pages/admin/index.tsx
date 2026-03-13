import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import Head from "next/head"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e8e8e8",
    fontFamily: "'Inter', sans-serif",
    padding: "0 0 80px",
  } as const,
  topBar: {
    background: "#0d0d0d",
    borderBottom: "1px solid #1e1e1e",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "22px",
    letterSpacing: "3px",
    color: "#d4af37",
    textShadow: "0 0 10px rgba(212,175,55,0.4)",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#888",
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    padding: "20px 24px 0",
    borderBottom: "1px solid #1e1e1e",
  },
  tab: (active: boolean) => ({
    padding: "10px 20px",
    borderRadius: "8px 8px 0 0",
    border: "1px solid " + (active ? "#d4af37" : "#1e1e1e"),
    borderBottom: active ? "1px solid #0d0d0d" : "1px solid #1e1e1e",
    background: active ? "#0d0d0d" : "transparent",
    color: active ? "#d4af37" : "#666",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.15s",
  } as const),
  panel: {
    padding: "32px 24px",
    maxWidth: "820px",
  },
  section: {
    marginBottom: "36px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    color: "#888",
    marginBottom: "6px",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#e8e8e8",
    fontSize: "14px",
    outline: "none",
    marginBottom: "12px",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#e8e8e8",
    fontSize: "14px",
    outline: "none",
    resize: "vertical" as const,
    minHeight: "100px",
    boxSizing: "border-box" as const,
    fontFamily: "'Inter', sans-serif",
  },
  saveBtn: {
    padding: "10px 28px",
    background: "#d4af37",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "13px",
  },
  addBtn: {
    padding: "8px 18px",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#d4af37",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "4px",
  },
  removeBtn: {
    padding: "4px 10px",
    background: "transparent",
    border: "1px solid #333",
    color: "#cc2478",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "8px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  statusMsg: (ok: boolean) => ({
    fontSize: "12px",
    color: ok ? "#00c6a2" : "#cc2478",
    marginTop: "8px",
  }),
  swatch: {
    width: "36px", height: "36px",
    border: "1px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    flexShrink: 0,
  },
  orderBtn: {
    padding: "4px 10px",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#888",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
}

type Tab = "theme" | "bio" | "media" | "layout" | "settings"
type MediaType = "movie" | "picture" | "event" | "flyer"

interface MediaItem {
  _id?: string
  type: MediaType
  url: string
  title: string
  caption: string
  date: string
  venue: string
  location: string
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("theme")
  const [token, setToken] = useState("")

  // Auth guard
  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) { router.replace("/admin/login"); return }
    setToken(t)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    router.replace("/admin/login")
  }

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  )

  if (!token) return null

  return (
    <>
      <Head><title>Admin — Osos Discos</title></Head>
      <div style={S.page}>

        {/* Top bar */}
        <div style={S.topBar}>
          <span style={S.logo}>OSOS DISCOS — ADMIN</span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a href="/" target="_blank" style={{ color: "#555", fontSize: "13px" }}>
              View site ↗
            </a>
            <button style={S.logoutBtn} onClick={logout}>Log out</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          {(["settings","theme","bio","media","layout"] as Tab[]).map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div style={S.panel}>
          {tab === "settings" && <SettingsPanel headers={headers} />}
          {tab === "theme"    && <ThemePanel    headers={headers} />}
          {tab === "bio"      && <BioPanel      headers={headers} />}
          {tab === "media"    && <MediaPanel    headers={headers} />}
          {tab === "layout"   && <LayoutPanel   headers={headers} />}
        </div>
      </div>
    </>
  )
}

// ── Settings Panel ────────────────────────────────────────────────────────────
function SettingsPanel({ headers }: { headers: () => Record<string, string> }) {
  const [s, setS] = useState({
    phone_video_url: "",
    soundcloud_url: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kineticnola&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=true",
    twitch_channel: "",
    live_mode: false,
    polaroid_photos: [] as string[],
    emailjs_service: "",
    emailjs_template: "",
    emailjs_key: "",
  })
  const [status, setStatus] = useState("")

  useEffect(() => {
    axios.get(`${API_URL}/api/settings`).then(r => setS({ ...s, ...r.data })).catch(() => {})
  }, [])

  const updatePolaroid = (i: number, val: string) =>
    setS(prev => ({ ...prev, polaroid_photos: prev.polaroid_photos.map((p, idx) => idx === i ? val : p) }))
  const addPolaroid    = () => setS(prev => ({ ...prev, polaroid_photos: [...prev.polaroid_photos, ""] }))
  const removePolaroid = (i: number) =>
    setS(prev => ({ ...prev, polaroid_photos: prev.polaroid_photos.filter((_, idx) => idx !== i) }))

  const save = async () => {
    try {
      await axios.put(`${API_URL}/api/settings`, s, { headers: headers() })
      setStatus("Saved ✓")
    } catch { setStatus("Save failed") }
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "26px", color: "#d4af37", marginBottom: "24px", letterSpacing: "2px" }}>
        Site Settings
      </h2>

      <div style={S.section}>
        <h3 style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Scene 1 — DJ Table</h3>
        <label style={S.label}>Phone screen video URL</label>
        <input style={S.input} placeholder="https://..." value={s.phone_video_url}
          onChange={e => setS(prev => ({ ...prev, phone_video_url: e.target.value }))} />

        <label style={S.label}>SoundCloud embed URL</label>
        <input style={S.input} placeholder="https://w.soundcloud.com/player/..." value={s.soundcloud_url}
          onChange={e => setS(prev => ({ ...prev, soundcloud_url: e.target.value }))} />

        <label style={S.label}>Twitch channel name</label>
        <input style={S.input} placeholder="yourchannelname" value={s.twitch_channel}
          onChange={e => setS(prev => ({ ...prev, twitch_channel: e.target.value }))} />

        <div style={{ ...S.row, marginBottom: "12px" }}>
          <label style={{ ...S.label, margin: 0 }}>Live mode (show Twitch instead of SoundCloud)</label>
          <input
            type="checkbox"
            checked={s.live_mode}
            onChange={e => setS(prev => ({ ...prev, live_mode: e.target.checked }))}
            style={{ width: 18, height: 18, marginLeft: 12, cursor: "pointer" }}
          />
        </div>
      </div>

      <div style={S.section}>
        <h3 style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Polaroid Photos (3–5)</h3>
        {s.polaroid_photos.map((url, i) => (
          <div key={i} style={S.row}>
            <input style={{ ...S.input, marginBottom: 0, flex: 1 }} value={url}
              onChange={e => updatePolaroid(i, e.target.value)} placeholder="https://image-url..." />
            <button style={S.removeBtn} onClick={() => removePolaroid(i)}>✕</button>
          </div>
        ))}
        {s.polaroid_photos.length < 5 && (
          <button style={S.addBtn} onClick={addPolaroid}>+ Add photo</button>
        )}
      </div>

      <div style={S.section}>
        <h3 style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>EmailJS (for event inquiry form)</h3>
        <label style={S.label}>Service ID</label>
        <input style={S.input} placeholder="service_xxxxxxx" value={s.emailjs_service}
          onChange={e => setS(prev => ({ ...prev, emailjs_service: e.target.value }))} />
        <label style={S.label}>Template ID</label>
        <input style={S.input} placeholder="template_xxxxxxx" value={s.emailjs_template}
          onChange={e => setS(prev => ({ ...prev, emailjs_template: e.target.value }))} />
        <label style={S.label}>Public Key</label>
        <input style={S.input} placeholder="your_public_key" value={s.emailjs_key}
          onChange={e => setS(prev => ({ ...prev, emailjs_key: e.target.value }))} />
      </div>

      <button style={S.saveBtn} onClick={save}>Save Settings</button>
      {status && <p style={S.statusMsg(status.includes("✓"))}>{status}</p>}
    </div>
  )
}

// ── Theme Panel ───────────────────────────────────────────────────────────────
function ThemePanel({ headers }: { headers: () => Record<string, string> }) {
  const [colors, setColors] = useState<Record<string, string>>({})
  const [fonts, setFonts]   = useState<Record<string, string>>({})
  const [status, setStatus] = useState("")

  useEffect(() => {
    axios.get(`${API_URL}/api/theme`).then(r => {
      setColors(r.data.colors ?? {})
      setFonts(r.data.fonts ?? {})
    }).catch(() => {})
  }, [])

  const colorLabels: [string, string][] = [
    ["bg",        "Background"],
    ["bgDark",    "Background (dark)"],
    ["bgCard",    "Card surface"],
    ["border",    "Border"],
    ["text",      "Body text"],
    ["textMuted", "Muted text"],
    ["gold",      "Gold accent"],
    ["magenta",   "Magenta accent"],
    ["teal",      "Teal / CTA"],
  ]
  const fontOptions = [
    "Bebas Neue", "Inter", "Playfair Display", "Montserrat",
    "Oswald", "Raleway", "Lato", "Poppins",
  ]

  const save = async () => {
    try {
      await axios.put(`${API_URL}/api/theme`, { colors, fonts }, { headers: headers() })
      // Apply immediately
      const root = document.documentElement
      Object.entries(colors).forEach(([k,v]) => root.style.setProperty(`--color-${k}`, v))
      Object.entries(fonts).forEach(([k,v])  => root.style.setProperty(`--font-${k}`, v))
      setStatus("Saved ✓")
    } catch { setStatus("Save failed") }
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "26px", color: "#d4af37", marginBottom: "24px", letterSpacing: "2px" }}>
        Theme
      </h2>

      <div style={{ ...S.section }}>
        <h3 style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Colors</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {colorLabels.map(([key, label]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="color"
                  value={colors[key] || "#000000"}
                  onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))}
                  style={{ ...S.swatch, padding: "2px" }}
                />
                <input
                  style={{ ...S.input, marginBottom: 0, flex: 1 }}
                  value={colors[key] || ""}
                  onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <h3 style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Fonts</h3>
        {(["display", "body", "accent"] as const).map(key => (
          <div key={key} style={{ marginBottom: "16px" }}>
            <label style={S.label}>{key} font</label>
            <select
              style={{ ...S.input, marginBottom: 0 }}
              value={fonts[key] || ""}
              onChange={e => setFonts(f => ({ ...f, [key]: e.target.value }))}
            >
              {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        ))}
      </div>

      <button style={S.saveBtn} onClick={save}>Save Theme</button>
      {status && <p style={S.statusMsg(status.includes("✓"))}>{status}</p>}
    </div>
  )
}

// ── Bio Panel ─────────────────────────────────────────────────────────────────
function BioPanel({ headers }: { headers: () => Record<string, string> }) {
  const [bio, setBio] = useState({ name: "", tagline: "", bio: "", photos: [] as string[], videos: [] as string[] })
  const [status, setStatus] = useState("")

  useEffect(() => {
    axios.get(`${API_URL}/api/bio`).then(r => setBio(r.data)).catch(() => {})
  }, [])

  const updateList = (field: "photos" | "videos", idx: number, val: string) => {
    setBio(b => ({ ...b, [field]: b[field].map((v, i) => i === idx ? val : v) }))
  }
  const addItem  = (field: "photos" | "videos") => setBio(b => ({ ...b, [field]: [...b[field], ""] }))
  const removeItem = (field: "photos" | "videos", idx: number) =>
    setBio(b => ({ ...b, [field]: b[field].filter((_, i) => i !== idx) }))

  const save = async () => {
    try {
      await axios.put(`${API_URL}/api/bio`, bio, { headers: headers() })
      setStatus("Saved ✓")
    } catch { setStatus("Save failed") }
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "26px", color: "#d4af37", marginBottom: "24px", letterSpacing: "2px" }}>Bio</h2>

      {(["name","tagline"] as const).map(field => (
        <div key={field} style={S.section}>
          <label style={S.label}>{field}</label>
          <input style={S.input} value={(bio as any)[field]} onChange={e => setBio(b => ({ ...b, [field]: e.target.value }))} />
        </div>
      ))}

      <div style={S.section}>
        <label style={S.label}>Bio text</label>
        <textarea style={S.textarea} value={bio.bio} onChange={e => setBio(b => ({ ...b, bio: e.target.value }))} />
      </div>

      {(["photos","videos"] as const).map(field => (
        <div key={field} style={S.section}>
          <label style={S.label}>{field === "photos" ? "Photo URLs" : "Video URLs (YouTube)"}</label>
          {bio[field].map((url, i) => (
            <div key={i} style={S.row}>
              <input style={{ ...S.input, marginBottom: 0, flex: 1 }} value={url}
                onChange={e => updateList(field, i, e.target.value)}
                placeholder={field === "photos" ? "https://..." : "https://youtube.com/watch?v=..."} />
              <button style={S.removeBtn} onClick={() => removeItem(field, i)}>✕</button>
            </div>
          ))}
          <button style={S.addBtn} onClick={() => addItem(field)}>+ Add {field === "photos" ? "photo" : "video"}</button>
        </div>
      ))}

      <button style={S.saveBtn} onClick={save}>Save Bio</button>
      {status && <p style={S.statusMsg(status.includes("✓"))}>{status}</p>}
    </div>
  )
}

// ── Media Panel ───────────────────────────────────────────────────────────────
function MediaPanel({ headers }: { headers: () => Record<string, string> }) {
  const [mediaTab, setMediaTab] = useState<MediaType>("movie")
  const [items, setItems] = useState<MediaItem[]>([])
  const [newItem, setNewItem] = useState<MediaItem>({ type: mediaTab, url: "", title: "", caption: "", date: "", venue: "", location: "" })
  const [status, setStatus] = useState("")

  const load = useCallback(() => {
    const endpoint = mediaTab === "movie" ? "movies" : mediaTab === "picture" ? "pictures" : mediaTab === "event" ? "events" : "flyers"
    axios.get(`${API_URL}/api/media/${endpoint}`).then(r => setItems(r.data)).catch(() => {})
  }, [mediaTab])

  useEffect(() => { load(); setNewItem(n => ({ ...n, type: mediaTab })) }, [mediaTab, load])

  const add = async () => {
    try {
      await axios.post(`${API_URL}/api/media`, newItem, { headers: headers() })
      setNewItem({ type: mediaTab, url: "", title: "", caption: "", date: "", venue: "", location: "" })
      setStatus("Added ✓"); load()
    } catch { setStatus("Failed") }
  }

  const remove = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/media/${id}`, { headers: headers() })
      setStatus("Removed ✓"); load()
    } catch { setStatus("Failed") }
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "26px", color: "#d4af37", marginBottom: "24px", letterSpacing: "2px" }}>Media</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" as const }}>
        {(["movie","picture","event","flyer"] as MediaType[]).map(t => (
          <button key={t} style={S.tab(mediaTab === t)} onClick={() => setMediaTab(t)}>
            {t === "movie" ? "Movies" : t === "picture" ? "Pictures" : t === "event" ? "Events" : "Flyers (Wall)"}
          </button>
        ))}
      </div>

      {/* Existing items */}
      {items.length === 0 && <p style={{ color: "#555", marginBottom: "24px" }}>No {mediaTab}s yet.</p>}
      {items.map(item => (
        <div key={item._id} style={{ ...S.row, background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "8px", flexWrap: "wrap" as const }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "13px", color: "#d4af37", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.title || "(untitled)"}</p>
            <p style={{ fontSize: "11px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.url}</p>
          </div>
          <button style={S.removeBtn} onClick={() => item._id && remove(item._id)}>Remove</button>
        </div>
      ))}

      {/* Add new */}
      <div style={{ marginTop: "24px", borderTop: "1px solid #1e1e1e", paddingTop: "24px" }}>
        <h3 style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>
          Add {mediaTab === "movie" ? "movie" : mediaTab === "picture" ? "picture" : mediaTab === "event" ? "event" : "flyer"}
        </h3>
        <input style={S.input} placeholder="URL *" value={newItem.url} onChange={e => setNewItem(n => ({ ...n, url: e.target.value }))} />
        <input style={S.input} placeholder="Title" value={newItem.title} onChange={e => setNewItem(n => ({ ...n, title: e.target.value }))} />
        {(mediaTab === "picture" || mediaTab === "event") && (
          <input style={S.input} placeholder="Caption" value={newItem.caption} onChange={e => setNewItem(n => ({ ...n, caption: e.target.value }))} />
        )}
        {mediaTab === "event" && (
          <>
            <input style={S.input} type="date" value={newItem.date} onChange={e => setNewItem(n => ({ ...n, date: e.target.value }))} />
            <input style={S.input} placeholder="Venue" value={newItem.venue} onChange={e => setNewItem(n => ({ ...n, venue: e.target.value }))} />
            <input style={S.input} placeholder="Location / City" value={newItem.location} onChange={e => setNewItem(n => ({ ...n, location: e.target.value }))} />
          </>
        )}
        <button style={S.saveBtn} onClick={add} disabled={!newItem.url}>Add</button>
        {status && <p style={S.statusMsg(status.includes("✓"))}>{status}</p>}
      </div>
    </div>
  )
}

// ── Layout Panel ──────────────────────────────────────────────────────────────
function LayoutPanel({ headers }: { headers: () => Record<string, string> }) {
  const LABELS: Record<string, string> = {
    hero: "Hero / Marquee", sound: "SoundCloud Player", movies: "Movie Reel",
    pictures: "Picture Carousel", events: "Event Flyers", bio: "Bio Panel", calendar: "Calendar",
  }
  const [sections, setSections] = useState([
    { type: "hero", order: 1 }, { type: "sound", order: 2 }, { type: "movies", order: 3 },
    { type: "pictures", order: 4 }, { type: "events", order: 5 }, { type: "bio", order: 6 }, { type: "calendar", order: 7 },
  ])
  const [status, setStatus] = useState("")

  useEffect(() => {
    axios.get(`${API_URL}/api/layout/home`).then(r => {
      if (r.data.sections?.length) setSections(r.data.sections)
    }).catch(() => {})
  }, [])

  const sorted = [...sections].sort((a, b) => a.order - b.order)

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sorted]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    const tmp = next[idx].order
    next[idx] = { ...next[idx], order: next[swap].order }
    next[swap] = { ...next[swap], order: tmp }
    setSections(next)
  }

  const save = async () => {
    try {
      await axios.put(`${API_URL}/api/layout/home`, { sections }, { headers: headers() })
      setStatus("Saved ✓")
    } catch { setStatus("Save failed") }
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "26px", color: "#d4af37", marginBottom: "8px", letterSpacing: "2px" }}>Layout</h2>
      <p style={{ color: "#555", fontSize: "13px", marginBottom: "24px" }}>Reorder the sections that appear on the home page.</p>

      {sorted.map((s, i) => (
        <div key={s.type} style={{ ...S.row, background: "#111", padding: "14px 16px", borderRadius: "8px", marginBottom: "6px" }}>
          <span style={{ color: "#444", fontSize: "13px", width: "20px" }}>{s.order}</span>
          <span style={{ flex: 1, fontSize: "14px" }}>{LABELS[s.type] ?? s.type}</span>
          <button style={S.orderBtn} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
          <button style={S.orderBtn} onClick={() => move(i, 1)} disabled={i === sorted.length - 1}>↓</button>
        </div>
      ))}

      <button style={{ ...S.saveBtn, marginTop: "16px" }} onClick={save}>Save Order</button>
      {status && <p style={S.statusMsg(status.includes("✓"))}>{status}</p>}
    </div>
  )
}
