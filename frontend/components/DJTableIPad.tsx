import { useState, useEffect } from "react"

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"]
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"]

type IPadView = "calendar" | "gear"

export default function DJTableIPad() {
  const [view, setView] = useState<IPadView>("calendar")
  const [today] = useState(new Date())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear]   = useState(today.getFullYear())

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

  const openBooking = (day: number) => {
    const dateStr = `${MONTH_NAMES[calMonth]} ${day}, ${calYear}`
    window.location.href = `/booking?date=${encodeURIComponent(dateStr)}`
  }

  return (
    <div style={screenStyle}>
      {/* Toggle bar */}
      <div style={toggleBarStyle}>
        <button style={toggleBtnStyle(view === "calendar")} onClick={() => setView("calendar")}>
          Cal
        </button>
        <button style={toggleBtnStyle(view === "gear")} onClick={() => setView("gear")}>
          Gear
        </button>
      </div>

      {/* Calendar view */}
      {view === "calendar" && (
        <div style={{ padding: "6px 8px 8px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Month header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <button style={navBtnStyle} onClick={prevMonth}>‹</button>
            <span style={{ fontSize: "clamp(9px,1.4vw,13px)", fontWeight: 700, color: "#111", letterSpacing: 1 }}>
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
            <button style={navBtnStyle} onClick={nextMonth}>›</button>
          </div>

          {/* Day labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 3 }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: "clamp(7px,1vw,10px)", color: "#888", fontWeight: 600 }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, flex: 1 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const past = isPast(day)
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
              return (
                <button
                  key={i}
                  disabled={past}
                  onClick={() => openBooking(day)}
                  style={{
                    background: isToday ? "#cc2478" : past ? "transparent" : "#f0f4ff",
                    color: isToday ? "#fff" : past ? "#ccc" : "#111",
                    border: isToday ? "none" : "1px solid #e0e0e0",
                    borderRadius: 3,
                    fontSize: "clamp(7px,1vw,11px)",
                    cursor: past ? "default" : "pointer",
                    padding: "3px 0",
                    fontWeight: isToday ? 700 : 400,
                    transition: "background 0.15s",
                  }}
                >{day}</button>
              )
            })}
          </div>

          {/* Book Now button */}
          <a
            href="/booking"
            style={{
              display: "block",
              marginTop: 6,
              padding: "6px 0",
              background: "#cc2478",
              color: "#fff",
              borderRadius: 5,
              fontSize: "clamp(8px,1.1vw,12px)",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              letterSpacing: 1,
              flexShrink: 0,
            }}
          >
            BOOK NOW →
          </a>
        </div>
      )}

      {/* Gear view */}
      {view === "gear" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 8, padding: 16 }}>
          <div style={{ fontSize: "clamp(10px,1.5vw,14px)", fontWeight: 700, color: "#111", textAlign: "center" }}>
            Gear Builder
          </div>
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
          >
            OPEN BUILDER →
          </a>
        </div>
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const screenStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#fff",
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
