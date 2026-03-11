import { useEffect, useState } from "react"
import CalendarWidget from "./CalendarWidget"

interface SelectedDay {
  date: string
  start: string
  end: string
  notes: string
}

const events = [
  { date: "Apr 12, 2026", venue: "Neon Festival — Main Stage", city: "Los Angeles, CA" },
  { date: "Apr 26, 2026", venue: "Club Voltage",               city: "Las Vegas, NV"   },
  { date: "May 3,  2026", venue: "Beachside Rave",             city: "Miami, FL"        },
  { date: "May 17, 2026", venue: "Warehouse Collective",       city: "Chicago, IL"      },
  { date: "Jun 7,  2026", venue: "Summer Solstice Festival",   city: "Austin, TX"       },
]

export default function EventCalendar() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 600)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleCalendarSubmit = (days: SelectedDay[]) => {
    alert("Consult request sent!\n" + JSON.stringify(days, null, 2))
  }

  return (
    <section
      id="calendar"
      style={{
        padding: mobile ? "48px 16px" : "60px 40px",
        background: "var(--color-bg-card, #111)",
        color: "var(--color-text, #e8e8e8)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
          fontSize: mobile ? "2rem" : "2.5rem",
          color: "var(--color-magenta, #cc2478)",
          letterSpacing: "0.06em",
          marginBottom: mobile ? 20 : 32,
          textShadow: "0 0 16px rgba(204,36,120,0.4)",
        }}
      >
        Upcoming Events
      </h2>

      {/* Events table — horizontal scroll on mobile */}
      {mobile ? (
        // Card list on small screens
        <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 10 }}>
          {events.map((event) => (
            <div
              key={event.date + event.venue}
              style={{
                background: "var(--color-bg, #0a0a0a)",
                border: "1px solid var(--color-border, #1e1e1e)",
                borderRadius: 8,
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 4px",
                    color: "var(--color-gold, #d4af37)",
                    fontSize: 12,
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {event.date}
                </p>
                <p style={{ margin: "0 0 2px", color: "var(--color-text, #e8e8e8)", fontSize: 14, fontWeight: 600 }}>
                  {event.venue}
                </p>
                <p style={{ margin: 0, color: "var(--color-text-muted, #a89060)", fontSize: 12 }}>
                  {event.city}
                </p>
              </div>
              <a
                href="/booking"
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--color-magenta, #cc2478)",
                  color: "var(--color-magenta, #cc2478)",
                  textDecoration: "none",
                  borderRadius: 4,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  minWidth: 44,
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Book
              </a>
            </div>
          ))}
        </div>
      ) : (
        // Table on desktop
        <div
          style={{
            border: "1px solid var(--color-border, #1e1e1e)",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 32,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-gold, #d4af37)",
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    letterSpacing: "0.06em",
                    fontWeight: 400,
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-gold, #d4af37)",
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    letterSpacing: "0.06em",
                    fontWeight: 400,
                  }}
                >
                  Venue
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-gold, #d4af37)",
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    letterSpacing: "0.06em",
                    fontWeight: 400,
                  }}
                >
                  Location
                </th>
                <th style={{ padding: "12px 16px" }} />
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.date + event.venue}
                  style={{ borderBottom: "1px solid var(--color-border, #1e1e1e)" }}
                >
                  <td style={{ padding: "16px", color: "var(--color-text-muted, #a89060)", whiteSpace: "nowrap" }}>
                    {event.date}
                  </td>
                  <td style={{ padding: "16px", color: "var(--color-text, #e8e8e8)" }}>{event.venue}</td>
                  <td style={{ padding: "16px", color: "var(--color-text-muted, #a89060)" }}>{event.city}</td>
                  <td style={{ padding: "16px" }}>
                    <a
                      href="/booking"
                      style={{
                        padding: "6px 16px",
                        border: "1px solid var(--color-magenta, #cc2478)",
                        color: "var(--color-magenta, #cc2478)",
                        textDecoration: "none",
                        borderRadius: 4,
                        fontSize: 13,
                      }}
                    >
                      Book
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CalendarWidget onSubmit={handleCalendarSubmit} />
    </section>
  )
}
