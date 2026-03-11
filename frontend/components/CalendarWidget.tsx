import { useState } from "react"
import { THEME, cardStyle } from "../styles/theme"

interface SelectedDay {
  date: string
  start: string
  end: string
  notes: string
}

export default function CalendarWidget({ onSubmit }: { onSubmit?: (days: SelectedDay[]) => void }) {
  const [selectedDays, setSelectedDays] = useState<SelectedDay[]>([])
  const [currentDate, setCurrentDate] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [notes, setNotes] = useState("")

  const addDay = () => {
    if (!currentDate || !start || !end) return
    setSelectedDays((prev) => [...prev, { date: currentDate, start, end, notes }])
    setCurrentDate("")
    setStart("")
    setEnd("")
    setNotes("")
  }

  const removeDay = (idx: number) => setSelectedDays((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = () => {
    if (onSubmit) onSubmit(selectedDays)
  }

  const inputStyle = {
    padding: "8px",
    borderRadius: "8px",
    border: `1px solid ${THEME.colors.border}`,
    background: THEME.colors.bgCard,
    color: THEME.colors.text,
  }

  return (
    <div style={cardStyle({ marginBottom: "32px" })}>
      {/* FIX: removed spurious `background` that was on the h3 in the second commit */}
      <h3 style={{ color: THEME.colors.accent, fontSize: "18px", marginBottom: "12px" }}>
        Select Event Dates
      </h3>

      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          style={inputStyle}
        />
        {/* FIX: removed duplicate `background` and `color` keys that were in the second commit */}
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start time"
          style={inputStyle}
        />
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End time"
          style={inputStyle}
        />
        <button
          onClick={addDay}
          style={{
            background: THEME.colors.accent,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Add Day
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes/questions for your consult request"
          style={{
            ...inputStyle,
            width: "100%",
            minHeight: "60px",
            marginBottom: "8px",
          }}
        />
      </div>

      <ul style={{ marginBottom: "12px" }}>
        {selectedDays.map((day, idx) => (
          <li key={idx} style={{ color: THEME.colors.textMuted, marginBottom: "6px" }}>
            {day.date} ({day.start}–{day.end})
            {day.notes && (
              <span style={{ color: THEME.colors.accentDark }}> — {day.notes}</span>
            )}
            <button
              onClick={() => removeDay(idx)}
              style={{
                marginLeft: "8px",
                color: THEME.colors.accent,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <span style={{ color: THEME.colors.textMuted, fontSize: "12px", marginRight: "12px" }}>
          Add instructions or questions below
        </span>
        <button
          onClick={handleSubmit}
          style={{
            background: THEME.colors.accent,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 24px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
