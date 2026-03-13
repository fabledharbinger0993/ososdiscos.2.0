import { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Settings {
  emailjs_service: string
  emailjs_template: string
  emailjs_key: string
}

type IPadView = "calendar" | "gear" | "form"

interface FormData {
  client_name: string
  client_email: string
  event_date: string
  event_type: string
  venue: string
  guest_count: string
  hours_needed: string
  notes: string
  // Wedding extras
  venue_confirmed: string
  ceremony_type: string
  catering: string
  style_prefs: string
  cocktail_hour: string
  special_songs: string
}

const BLANK_FORM: FormData = {
  client_name: "", client_email: "", event_date: "", event_type: "",
  venue: "", guest_count: "", hours_needed: "", notes: "",
  venue_confirmed: "", ceremony_type: "", catering: "",
  style_prefs: "", cocktail_hour: "", special_songs: "",
}

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"]
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"]

export default function DJTableIPad() {
  const [view, setView] = useState<IPadView>("calendar")
  const [settings, setSettings] = useState<Settings>({ emailjs_service: "", emailjs_template: "", emailjs_key: "" })
  const [today] = useState(new Date())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear]   = useState(today.getFullYear())
  const [form, setForm] = useState<FormData>(BLANK_FORM)
  const [isWedding, setIsWedding] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"" | "sending" | "sent" | "error">("")

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(r => r.json())
      .then(d => setSettings(d))
      .catch(() => {})
  }, [])

  const openForm = (dateStr: string) => {
    setForm({ ...BLANK_FORM, event_date: dateStr })
    setIsWedding(false)
    setSubmitStatus("")
    setView("form")
  }

  const handleSubmit = async () => {
    if (!form.client_name || !form.client_email || !form.event_date) return
    setSubmitStatus("sending")
    try {
      const { emailjs_service, emailjs_template, emailjs_key } = settings
      if (!emailjs_service || !emailjs_template || !emailjs_key) {
        // Fallback: mailto
        const body = buildEmailBody()
        window.open(`mailto:info@ososdiscos.com?subject=Event Inquiry — ${form.event_date}&body=${encodeURIComponent(body)}`)
        setSubmitStatus("sent")
        return
      }
      await emailjs.send(emailjs_service, emailjs_template, {
        from_name:    form.client_name,
        from_email:   form.client_email,
        event_date:   form.event_date,
        event_type:   form.event_type,
        venue:        form.venue,
        guest_count:  form.guest_count,
        hours_needed: form.hours_needed,
        notes:        isWedding ? buildWeddingNotes() : form.notes,
      }, emailjs_key)
      setSubmitStatus("sent")
    } catch {
      setSubmitStatus("error")
    }
  }

  const buildWeddingNotes = () =>
    `Venue confirmed: ${form.venue_confirmed}\nCeremony type: ${form.ceremony_type}\nCatering: ${form.catering}\nStyle: ${form.style_prefs}\nCocktail hour: ${form.cocktail_hour}\nSpecial songs: ${form.special_songs}\n\n${form.notes}`

  const buildEmailBody = () =>
    `Name: ${form.client_name}\nEmail: ${form.client_email}\nDate: ${form.event_date}\nType: ${form.event_type}\nVenue: ${form.venue}\nGuests: ${form.guest_count}\nHours: ${form.hours_needed}\nNotes: ${isWedding ? buildWeddingNotes() : form.notes}`

  // Build calendar grid
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  const isPast = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    d.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return d < t
  }

  const field = (k: keyof FormData, placeholder: string, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[k]}
      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
      style={inputStyle}
    />
  )

  return (
    <div style={outerStyle}>
      {/* iPad frame */}
      <div style={frameStyle}>
        {/* Screen */}
        <div style={screenStyle}>
          {/* Toggle buttons — calendar / gear */}
          {view !== "form" && (
            <div style={toggleBarStyle}>
              <button
                style={toggleBtnStyle(view === "calendar")}
                onClick={() => setView("calendar")}
              >Cal</button>
              <button
                style={toggleBtnStyle(view === "gear")}
                onClick={() => setView("gear")}
              >Gear</button>
            </div>
          )}

          {/* Calendar view */}
          {view === "calendar" && (
            <div style={{ padding: "6px 8px 8px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Month header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <button style={navBtnStyle} onClick={prevMonth}>‹</button>
                <span style={{ fontSize: "clamp(9px,1.4vw,13px)", fontWeight: 700, color: "#111", letterSpacing: 1 }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button style={navBtnStyle} onClick={nextMonth}>›</button>
              </div>
              {/* Day names */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, marginBottom: 2 }}>
                {DAY_NAMES.map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: "clamp(7px,1vw,10px)", color: "#888", fontWeight: 600 }}>{d}</div>
                ))}
              </div>
              {/* Days grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, flex: 1 }}>
                {cells.map((day, i) => {
                  if (!day) return <div key={i} />
                  const past = isPast(day)
                  const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                  return (
                    <button
                      key={i}
                      disabled={past}
                      onClick={() => openForm(`${MONTH_NAMES[calMonth]} ${day}, ${calYear}`)}
                      style={{
                        background: isToday ? "#cc2478" : past ? "transparent" : "#f0f4ff",
                        color: isToday ? "#fff" : past ? "#ccc" : "#111",
                        border: isToday ? "none" : "1px solid #e0e0e0",
                        borderRadius: 3,
                        fontSize: "clamp(7px,1vw,11px)",
                        cursor: past ? "default" : "pointer",
                        padding: "2px 0",
                        fontWeight: isToday ? 700 : 400,
                        transition: "background 0.15s",
                      }}
                    >{day}</button>
                  )
                })}
              </div>
              <p style={{ fontSize: "clamp(7px,0.9vw,9px)", color: "#999", textAlign: "center", marginTop: 4 }}>
                Tap a date to request a quote
              </p>
            </div>
          )}

          {/* Gear builder view */}
          {view === "gear" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, padding: 16 }}>
              <div style={{ fontSize: "clamp(10px,1.5vw,14px)", fontWeight: 700, color: "#111", textAlign: "center" }}>Gear Builder</div>
              <p style={{ fontSize: "clamp(8px,1vw,11px)", color: "#555", textAlign: "center", margin: 0 }}>
                Build your custom audio setup
              </p>
              <a
                href="/gear"
                style={{
                  marginTop: 8,
                  padding: "8px 18px",
                  background: "#cc2478",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: "clamp(8px,1.1vw,12px)",
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: 1,
                }}
              >OPEN BUILDER →</a>
            </div>
          )}

          {/* Inquiry form view */}
          {view === "form" && (
            <div style={{ padding: "8px 10px", height: "100%", overflow: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <button style={{ ...navBtnStyle, fontSize: "clamp(8px,1vw,12px)" }} onClick={() => setView("calendar")}>← Back</button>
                <span style={{ fontSize: "clamp(8px,1vw,11px)", fontWeight: 700, color: "#111" }}>
                  {form.event_date}
                </span>
              </div>

              {submitStatus === "sent" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 16 }}>
                  <div style={{ fontSize: 28 }}>✓</div>
                  <p style={{ fontSize: "clamp(9px,1.2vw,13px)", color: "#111", fontWeight: 700, textAlign: "center" }}>
                    Inquiry sent!
                  </p>
                  <p style={{ fontSize: "clamp(7px,0.9vw,10px)", color: "#555", textAlign: "center" }}>
                    We'll reach out to you soon.
                  </p>
                  <button style={{ ...submitBtnStyle, marginTop: 8 }} onClick={() => { setView("calendar"); setSubmitStatus("") }}>
                    Back to Calendar
                  </button>
                </div>
              ) : (
                <>
                  {field("client_name", "Your name *")}
                  {field("client_email", "Email address *", "email")}
                  {field("event_type", "Event type (wedding, party, festival…)")}
                  {field("venue", "Venue / address")}
                  {field("guest_count", "Approx. guest count")}
                  {field("hours_needed", "How many hours?")}

                  {/* Wedding toggle */}
                  <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer" }}>
                    <input type="checkbox" checked={isWedding} onChange={e => setIsWedding(e.target.checked)} />
                    <span style={{ fontSize: "clamp(7px,0.9vw,10px)", color: "#555" }}>This is a wedding</span>
                  </label>

                  {isWedding && (
                    <>
                      <select style={inputStyle} value={form.venue_confirmed} onChange={e => setForm(f => ({ ...f, venue_confirmed: e.target.value }))}>
                        <option value="">Venue confirmed?</option>
                        <option value="yes">Yes</option>
                        <option value="no">Not yet</option>
                      </select>
                      <select style={inputStyle} value={form.ceremony_type} onChange={e => setForm(f => ({ ...f, ceremony_type: e.target.value }))}>
                        <option value="">Ceremony, reception, or both?</option>
                        <option value="ceremony">Ceremony only</option>
                        <option value="reception">Reception only</option>
                        <option value="both">Both</option>
                      </select>
                      {field("catering", "Catering situation")}
                      {field("style_prefs", "Music style preferences")}
                      <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer" }}>
                        <input type="checkbox" checked={form.cocktail_hour === "yes"} onChange={e => setForm(f => ({ ...f, cocktail_hour: e.target.checked ? "yes" : "no" }))} />
                        <span style={{ fontSize: "clamp(7px,0.9vw,10px)", color: "#555" }}>Cocktail hour needed</span>
                      </label>
                      {field("special_songs", "Special song requests")}
                    </>
                  )}

                  <textarea
                    placeholder="Notes / anything else"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 48, resize: "vertical" }}
                  />

                  <button
                    style={{ ...submitBtnStyle, opacity: (form.client_name && form.client_email) ? 1 : 0.5 }}
                    disabled={!form.client_name || !form.client_email || submitStatus === "sending"}
                    onClick={handleSubmit}
                  >
                    {submitStatus === "sending" ? "Sending…" : "Send for Quote & Consult"}
                  </button>
                  {submitStatus === "error" && (
                    <p style={{ fontSize: "clamp(7px,0.9vw,10px)", color: "#cc2478", marginTop: 4 }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Home button */}
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#ccc", border: "2px solid #aaa", flexShrink: 0 }} />
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const outerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "stretch",
}

const frameStyle: React.CSSProperties = {
  flex: 1,
  background: "#1a1a1a",
  borderRadius: "clamp(6px,1vw,12px)",
  border: "2px solid #333",
  boxShadow: "0 4px 20px rgba(0,0,0,0.6), inset 0 0 0 2px #111",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "8px 6px 10px",
  gap: 6,
  overflow: "hidden",
}

const screenStyle: React.CSSProperties = {
  flex: 1,
  width: "100%",
  background: "#fff",
  borderRadius: "clamp(3px,0.5vw,6px)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  position: "relative",
}

const toggleBarStyle: React.CSSProperties = {
  display: "flex",
  borderBottom: "1px solid #e0e0e0",
  background: "#f5f5f5",
  flexShrink: 0,
}

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "4px 0",
  background: active ? "#fff" : "transparent",
  border: "none",
  borderBottom: active ? "2px solid #cc2478" : "2px solid transparent",
  color: active ? "#cc2478" : "#888",
  fontSize: "clamp(8px,1vw,11px)",
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 1,
})

const navBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #ddd",
  borderRadius: 4,
  padding: "1px 6px",
  cursor: "pointer",
  fontSize: "clamp(9px,1.2vw,13px)",
  color: "#444",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px 6px",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontSize: "clamp(7px,0.9vw,10px)",
  marginBottom: 4,
  boxSizing: "border-box",
  fontFamily: "inherit",
  outline: "none",
  color: "#111",
}

const submitBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 0",
  background: "#cc2478",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  fontSize: "clamp(7px,0.9vw,10px)",
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 0.5,
  marginTop: 4,
}
