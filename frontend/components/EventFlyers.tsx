import { useState, useEffect } from "react"
import axios from "axios"
import { THEME, carouselContainerStyle } from "../styles/theme"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type Event = { date: string; venue: string; flyerUrl: string; title: string }

export default function EventFlyers() {
  const [events, setEvents] = useState<Event[]>([])
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/media/events`).then((res) => setEvents(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!autoPlay || events.length === 0) return
    const timer = setInterval(() => setCurrent((p) => (p + 1) % events.length), 6000)
    return () => clearInterval(timer)
  }, [autoPlay, events.length])

  if (events.length === 0) return null

  const event = events[current]

  return (
    <section style={{ padding: "60px 40px", background: THEME.colors.bg, color: THEME.colors.text }}>
      <h2 style={{ color: "var(--color-teal)", fontSize: "36px", marginBottom: "24px" }}>
        Upcoming Gigs
      </h2>

      <div style={carouselContainerStyle}>
        <img
          src={event.flyerUrl}
          alt={event.title}
          style={{ width: "100%", height: "600px", objectFit: "cover", display: "block" }}
        />

        {/* Event info overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
            padding: "32px 16px 16px",
            color: THEME.colors.text,
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{event.title}</h3>
          <p style={{ margin: "0 0 4px 0", color: "var(--color-teal)", fontSize: "14px" }}>
            {event.date}
          </p>
          <p style={{ margin: 0, color: THEME.colors.textMuted, fontSize: "13px" }}>
            {event.venue}
          </p>
        </div>

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setCurrent((p) => (p - 1 + events.length) % events.length)}
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
             Prev
          </button>

          <span style={{ color: THEME.colors.textMuted, fontSize: "12px", padding: "8px 12px" }}>
            {current + 1} / {events.length}
          </span>

          <button
            onClick={() => setCurrent((p) => (p + 1) % events.length)}
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Next 
          </button>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              background: autoPlay ? "var(--color-teal)" : "rgba(0,0,0,0.6)",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {autoPlay ? "" : ""}
          </button>
        </div>
      </div>
    </section>
  )
}
