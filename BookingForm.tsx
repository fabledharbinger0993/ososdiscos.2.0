import { useState, FormEvent, CSSProperties } from "react"

const BOOKING_EMAIL = "booking@ososdiscos.com"

// ── shared styles ────────────────────────────────────────────────────────────

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "#1a1a1a",
  border: "1px solid #2e2e2e",
  borderRadius: "18px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
}

const labelStyle: CSSProperties = {
  display: "block",
  color: "#ccc",
  fontSize: "13px",
  marginBottom: "6px",
  fontWeight: 500,
}

const fieldStyle: CSSProperties = { marginBottom: "20px" }

const optionalTag: CSSProperties = {
  color: "#555",
  fontWeight: 400,
  marginLeft: "6px",
  fontSize: "12px",
}

const sectionDivider: CSSProperties = {
  marginTop: "32px",
  paddingTop: "32px",
  borderTop: "1px solid #2e2e2e",
}

const infoBox = (color = "#1a1a1a"): CSSProperties => ({
  background: color,
  border: "1px solid #2e2e2e",
  borderRadius: "18px",
  padding: "20px 24px",
  marginBottom: "24px",
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#aaa",
})

// ── day / time toggles ───────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const TIME_SLOTS = ["Morning (9 am – 12 pm)", "Afternoon (12 – 5 pm)", "Evening (5 – 10 pm)", "Late Night (10 pm+)"]

function CheckGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (val: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt])

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: "6px 16px",
              borderRadius: "18px",
              border: `1px solid ${active ? "#ff2d95" : "#2e2e2e"}`,
              background: active ? "#ff2d95" : "#1a1a1a",
              color: active ? "#fff" : "#888",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ── path selector ────────────────────────────────────────────────────────────

type BookingPath = "guthrie-selects" | "client-directed" | null

function PathCard({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean
  onClick: () => void
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: "220px",
        padding: "24px",
        background: active ? "#1a0010" : "#111",
        border: `2px solid ${active ? "#ff2d95" : "#2e2e2e"}`,
        borderRadius: "18px",
        color: "#fff",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ color: active ? "#ff2d95" : "#fff", fontWeight: 700, marginBottom: "8px", fontSize: "15px" }}>
        {title}
      </div>
      <div style={{ color: "#888", fontSize: "13px", lineHeight: "1.5" }}>{description}</div>
    </button>
  )
}

// ── main component ───────────────────────────────────────────────────────────

export default function BookingForm() {
  // path
  const [path, setPath] = useState<BookingPath>(null)

  // base fields
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [eventType, setEventType] = useState("")
  const [indoorOutdoor, setIndoorOutdoor] = useState("")
  const [eventDateTime, setEventDateTime] = useState("")
  const [location, setLocation] = useState("")

  // consult scheduling
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [preferredTimes, setPreferredTimes] = useState<string[]>([])
  const [consultRequest, setConsultRequest] = useState("")

  // wedding-specific
  const [pointOfContact, setPointOfContact] = useState("")
  const [rules, setRules] = useState("")
  const [ceremonyPlaylist, setCeremonyPlaylist] = useState("")
  const [receptionPlaylist, setReceptionPlaylist] = useState("")
  const [afterpartyPlaylist, setAfterpartyPlaylist] = useState("")

  const isWedding =
    path === "client-directed" && eventType.trim().toLowerCase() === "wedding"

  // ── build email body ───────────────────────────────────────────────────────

  const buildBody = () => {
    const separator = "\n" + "─".repeat(40) + "\n"

    const base = [
      `BOOKING TYPE: ${path === "guthrie-selects" ? "Osos Discos Selects (House / Disco)" : "Client-Directed"}`,
      "",
      "EVENT DETAILS",
      `Client Name:     ${clientName}`,
      `Client Email:    ${clientEmail}`,
      `Event Type:      ${eventType || "(see booking type)"}`,
      `Indoor/Outdoor:  ${indoorOutdoor || "TBD"}`,
      `Date / Time:     ${eventDateTime}`,
      `Location:        ${location || "TBD"}`,
    ].join("\n")

    const consult = [
      "CONSULT REQUEST",
      `Available Days:  ${availableDays.length ? availableDays.join(", ") : "Not specified"}`,
      `Preferred Times: ${preferredTimes.length ? preferredTimes.join(", ") : "Not specified"}`,
      `Requested Date/Time: ${consultRequest || "Flexible — please suggest"}`,
      "",
      "Note: All consult times are subject to confirmation. We will reply within 48 hours to confirm or propose an alternative.",
    ].join("\n")

    const weddingSection = isWedding
      ? [
          "WEDDING DETAILS",
          `Point of Contact: ${pointOfContact}`,
          `Rules / Directives / Dress Code:\n${rules || "None provided"}`,
          "",
          "Music Playlists (to be confirmed at consult):",
          ceremonyPlaylist ? `  Ceremony:   ${ceremonyPlaylist}` : "  Ceremony:   To be provided",
          receptionPlaylist ? `  Reception:  ${receptionPlaylist}` : "  Reception:  To be provided",
          afterpartyPlaylist ? `  Afterparty: ${afterpartyPlaylist}` : "  Afterparty: To be provided",
        ].join("\n")
      : null

    const parts = [base, separator + consult]
    if (weddingSection) parts.push(separator + weddingSection)

    const clientNote = [
      separator,
      "──── YOUR CONFIRMATION COPY ────",
      "Thank you for your booking request! Here's a summary of what we received.",
      "",
      "NEXT STEPS:",
      "1. We'll review your request and reach out within 48 hours to schedule your consult call.",
      "2. During the consult we'll lock in event details, discuss your vision, and answer any questions.",
      isWedding
        ? "3. Your playlist links will be required before your event date. You can send them to " +
          BOOKING_EMAIL +
          " any time — or bring them to the consult call."
        : "",
      "",
      "Questions? Reply to this email or contact us at " + BOOKING_EMAIL,
    ]
      .filter(Boolean)
      .join("\n")

    parts.push(clientNote)
    return parts.join("\n")
  }

  // ── submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!path) return

    const body = buildBody()
    const subject = "Booking Request"

    window.location.href = `mailto:${BOOKING_EMAIL}?cc=${encodeURIComponent(
      clientEmail
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: "18px",
        padding: "40px",
      }}
    >
      <h2 style={{ color: "#ff2d95", fontSize: "28px", marginBottom: "8px" }}>Booking Request</h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
        Select a booking type below to get started. Every booking includes a complimentary consult
        call before we confirm your date.
      </p>

      {/* ── Step 1: path ── */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
        <PathCard
          active={path === "guthrie-selects"}
          onClick={() => { setPath("guthrie-selects"); setEventType("") }}
          title="Osos Discos Selects"
          description="House, disco, and dance floor grooves — curated by us. No playlist required."
        />
        <PathCard
          active={path === "client-directed"}
          onClick={() => setPath("client-directed")}
          title="Client-Directed"
          description="You set the vibe. Provide music direction, playlists, or a specific sound. Includes weddings."
        />
      </div>

      {path && (
        <form onSubmit={handleSubmit}>

          {/* ── Base fields ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Client Name</label>
            <input
              style={inputStyle}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              placeholder="Your full name or organisation"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Your Email</label>
            <input
              style={{ ...inputStyle }}
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <p style={{ color: "#555", fontSize: "11px", marginTop: "6px", marginLeft: "4px" }}>
              You'll receive a confirmation copy of this request at this address.
            </p>
          </div>

          {path === "client-directed" && (
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Event Name / Type
                <span style={optionalTag}>(type "Wedding" to unlock wedding fields)</span>
              </label>
              <input
                style={inputStyle}
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                placeholder="e.g. Wedding, Corporate, Birthday, Festival…"
              />
            </div>
          )}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Indoor / Outdoor<span style={optionalTag}>optional</span>
            </label>
            <select
              style={{ ...inputStyle, appearance: "none" as const }}
              value={indoorOutdoor}
              onChange={(e) => setIndoorOutdoor(e.target.value)}
            >
              <option value="">TBD / Leave blank</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Event Date / Time</label>
            <input
              style={inputStyle}
              value={eventDateTime}
              onChange={(e) => setEventDateTime(e.target.value)}
              required
              placeholder="e.g. June 14, 2026 — 7:00 PM"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Location<span style={optionalTag}>optional</span>
            </label>
            <input
              style={inputStyle}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Venue name, city, or TBD"
            />
          </div>

          {/* ── Consult scheduling ── */}
          <div style={sectionDivider}>
            <h3 style={{ color: "#ff2d95", fontSize: "17px", marginBottom: "6px" }}>
              Consult Call Availability
            </h3>
            <p style={{ color: "#666", fontSize: "13px", marginBottom: "24px" }}>
              Every booking begins with a consult call. Let us know when you're generally available
              and we'll reach out to confirm a time.
            </p>

            <div style={fieldStyle}>
              <label style={labelStyle}>Available Days</label>
              <CheckGroup
                options={DAYS}
                selected={availableDays}
                onChange={setAvailableDays}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Preferred Times</label>
              <CheckGroup
                options={TIME_SLOTS}
                selected={preferredTimes}
                onChange={setPreferredTimes}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Specific Date / Time Request<span style={optionalTag}>optional — requires our confirmation</span>
              </label>
              <input
                style={inputStyle}
                value={consultRequest}
                onChange={(e) => setConsultRequest(e.target.value)}
                placeholder="e.g. Tuesday May 6, around 2 pm"
              />
              <p style={{ color: "#555", fontSize: "11px", marginTop: "6px", marginLeft: "4px" }}>
                We'll confirm within 48 hours or suggest an alternative if needed.
              </p>
            </div>
          </div>

          {/* ── Wedding section ── */}
          {isWedding && (
            <div style={sectionDivider}>
              <h3 style={{ color: "#ff2d95", fontSize: "17px", marginBottom: "16px" }}>
                Wedding Details
              </h3>

              <div style={infoBox("#0d0008")}>
                <span style={{ color: "#ff2d95", fontWeight: 600 }}>Heads up:</span> Playlist links
                are required for your wedding but don't need to be submitted right now. We'll go
                over everything during your consult call. You can send them to{" "}
                <span style={{ color: "#ccc" }}>{BOOKING_EMAIL}</span> any time before your event
                date.
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Point of Contact</label>
                <input
                  style={inputStyle}
                  value={pointOfContact}
                  onChange={(e) => setPointOfContact(e.target.value)}
                  required
                  placeholder="Name and phone/email of day-of contact"
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Rules / Directives / Dress Code</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px", resize: "vertical" as const, borderRadius: "14px" }}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Song restrictions, dress code, special instructions, etc."
                />
              </div>

              <div
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #2e2e2e",
                  borderRadius: "18px",
                  padding: "24px",
                  marginBottom: "20px",
                }}
              >
                <label style={{ ...labelStyle, color: "#ccc", fontSize: "14px", marginBottom: "4px" }}>
                  Music Playlists
                  <span style={{ color: "#555", fontSize: "12px", fontWeight: 400, marginLeft: "8px" }}>
                    optional now — required before your event
                  </span>
                </label>
                <p style={{ color: "#555", fontSize: "12px", marginBottom: "20px" }}>
                  Apple Music or Spotify links for Ceremony, Reception, and/or Afterparty.
                </p>

                {[
                  { label: "Ceremony", val: ceremonyPlaylist, set: setCeremonyPlaylist },
                  { label: "Reception", val: receptionPlaylist, set: setReceptionPlaylist },
                  { label: "Afterparty", val: afterpartyPlaylist, set: setAfterpartyPlaylist },
                ].map(({ label, val, set }) => (
                  <div key={label} style={{ marginBottom: "16px" }}>
                    <label style={{ ...labelStyle }}>
                      {label}<span style={optionalTag}>optional</span>
                    </label>
                    <input
                      style={inputStyle}
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder="Apple Music or Spotify playlist URL"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          <div style={{ marginTop: "32px" }}>
            <div style={infoBox()}>
              By clicking Send, your email client will open with this request pre-composed — just
              hit send. A copy will be sent to your email address as confirmation.
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#ff2d95",
                color: "#fff",
                border: "none",
                borderRadius: "18px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Send Booking Request
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
