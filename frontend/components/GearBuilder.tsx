import { useState, useEffect } from "react"

// ── Pricing config (edit these to adjust rates) ───────────────────────────────

const BASE_PRICE = { standard: 200, wedding: 500 }
const INCLUDED_HOURS = 4
const HOURLY_OVERAGE = 50

// ── Gear catalog ──────────────────────────────────────────────────────────────

type GearItem = {
  id: string
  category: string
  name: string
  desc: string
  note?: string
  maxQty: number
  priceEach: number
}

const CATALOG: GearItem[] = [
  { id: "mains",      category: "Audio",    name: "Main Speakers",       desc: "Full-range front-of-house mains",                    maxQty: 4,  priceEach: 60  },
  { id: "subs",       category: "Audio",    name: "Subwoofers",          desc: "Bass reinforcement",                                 maxQty: 4,  priceEach: 50  },
  { id: "monitors",   category: "Audio",    name: "Stage Monitors",      desc: "Wedge monitors (always included for our use)",       maxQty: 2,  priceEach: 35  },
  { id: "mics",       category: "Audio",    name: "Microphones",         desc: "Handheld dynamic mics",                              maxQty: 2,  priceEach: 30  },
  { id: "booth",      category: "DJ Setup", name: "DJ Booth",            desc: "Professional DJ facade",                             maxQty: 1,  priceEach: 120 },
  { id: "mixer",      category: "DJ Setup", name: "Mixer",               desc: "Professional DJ mixer",                              maxQty: 1,  priceEach: 80  },
  { id: "cdj",        category: "DJ Setup", name: "CDJ-3000",            desc: "Industry-standard media players",                    maxQty: 2,  priceEach: 75  },
  { id: "controller", category: "DJ Setup", name: "Controller",          desc: "Great for lower-profile events", note: "Ideal for country clubs & wedding ceremonies", maxQty: 1, priceEach: 60 },
  { id: "lighttower", category: "Lighting", name: "Party Light Tower",   desc: "Full-effect LED lighting tower",                     maxQty: 1,  priceEach: 100 },
  { id: "parlights",  category: "Lighting", name: "Par Lights",          desc: "LED par cans",                                       maxQty: 10, priceEach: 12  },
  { id: "tent1010",   category: "Shelter",  name: "10×10 Tent",          desc: "10ft × 10ft canopy",                                 maxQty: 1,  priceEach: 80  },
  { id: "tent1212",   category: "Shelter",  name: "12×12 Tent",          desc: "12ft × 12ft canopy",                                 maxQty: 1,  priceEach: 100 },
  { id: "tentHex",    category: "Shelter",  name: "14ft Hexagon Tent",   desc: "14ft hexagonal canopy",                              maxQty: 1,  priceEach: 150 },
]

const CATEGORIES = ["Audio", "DJ Setup", "Lighting", "Shelter"]

// ── Sub-components ────────────────────────────────────────────────────────────

function GearImageSlot({ name, active }: { name: string; active: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "120px",
        background: active ? "#0d0008" : "var(--color-bg, #0a0a0a)",
        border: `1px dashed ${active ? "var(--color-magenta, #cc2478)" : "var(--color-border, #1e1e1e)"}`,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "12px",
        transition: "all 0.2s",
      }}
    >
      {/* Replace with: <img src="/gear-images/{id}.png" alt={name} style={{width:"100%",height:"100%",objectFit:"contain"}} /> */}
      <span style={{ fontSize: "28px", marginBottom: "6px" }}>📦</span>
      <span style={{ color: "var(--color-border, #1e1e1e)", fontSize: "11px" }}>Image coming soon</span>
    </div>
  )
}

function QtyControl({ qty, max, onChange }: { qty: number; max: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, qty - 1))}
        disabled={qty === 0}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: qty === 0 ? "var(--color-bg, #0a0a0a)" : "var(--color-bg-card, #111)",
          border: "1px solid var(--color-border, #1e1e1e)",
          color: qty === 0 ? "#444" : "var(--color-text, #e8e8e8)",
          cursor: qty === 0 ? "not-allowed" : "pointer", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        −
      </button>
      <span style={{ color: qty > 0 ? "var(--color-text, #e8e8e8)" : "#444", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty === max}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: qty === max ? "var(--color-bg, #0a0a0a)" : "var(--color-magenta, #cc2478)",
          border: "none", color: "#fff",
          cursor: qty === max ? "not-allowed" : "pointer", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        +
      </button>
      <span style={{ color: "var(--color-text-muted, #a89060)", fontSize: "12px" }}>/ {max}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GearBuilder() {
  const [eventType, setEventType] = useState<"standard" | "wedding">("standard")
  const [hours, setHours] = useState(4)
  const [selection, setSelection] = useState<Record<string, number>>({})
  const [mobile, setMobile] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const setQty = (id: string, qty: number) =>
    setSelection((prev) => ({ ...prev, [id]: qty }))

  const base = BASE_PRICE[eventType]
  const gearCost = CATALOG.reduce((sum, item) => sum + (selection[item.id] || 0) * item.priceEach, 0)
  const overtimeHours = Math.max(0, hours - INCLUDED_HOURS)
  const overtimeCost = overtimeHours * HOURLY_OVERAGE
  const subtotal = base + gearCost + overtimeCost
  const selectedItems = CATALOG.filter((item) => (selection[item.id] || 0) > 0)

  const buildQuoteEmail = () => {
    const lines = [
      `GEAR RENTAL QUOTE REQUEST`,
      `Event Type: ${eventType === "wedding" ? "Wedding" : "Standard Event"}`,
      `Duration: ${hours} hour${hours !== 1 ? "s" : ""}`,
      "",
      "Selected Gear:",
      ...selectedItems.map(
        (item) => `  ${item.name} × ${selection[item.id]}  —  $${(selection[item.id] || 0) * item.priceEach}`
      ),
      "",
      `Base Rate:        $${base}`,
      gearCost > 0 ? `Gear:             $${gearCost}` : null,
      overtimeCost > 0 ? `Overtime (${overtimeHours}h):  $${overtimeCost}` : null,
      `Estimated Total:  $${subtotal}`,
      "",
      "Note: Final pricing is confirmed during your consult call. Adjustments may apply.",
    ]
      .filter((l) => l !== null)
      .join("\n")

    window.location.href = `mailto:booking@ososdiscos.com?subject=${encodeURIComponent(
      "Gear Rental Quote Request"
    )}&body=${encodeURIComponent(lines)}`
  }

  const quoteSidebar = (
    <div
      style={{
        background: "var(--color-bg-card, #111)",
        border: "1px solid var(--color-border, #1e1e1e)",
        borderRadius: 8,
        padding: "24px",
        ...(mobile
          ? {}
          : { width: 280, flexShrink: 0, position: "sticky", top: 100 }),
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
          color: "var(--color-gold, #d4af37)",
          fontSize: "1.2rem",
          letterSpacing: "0.08em",
          marginBottom: 20,
          textShadow: "0 0 12px rgba(212,175,55,0.4)",
        }}
      >
        Your Build
      </h3>

      {selectedItems.length === 0 ? (
        <p style={{ color: "var(--color-border, #1e1e1e)", fontSize: "13px", marginBottom: "20px" }}>
          Select gear to the left to build your quote.
        </p>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          {selectedItems.map((item) => (
            <div
              key={item.id}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px" }}
            >
              <span style={{ color: "var(--color-text-muted, #a89060)" }}>
                {item.name} <span style={{ color: "#555" }}>×{selection[item.id]}</span>
              </span>
              <span style={{ color: "var(--color-text, #e8e8e8)" }}>${(selection[item.id] || 0) * item.priceEach}</span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          borderTop: "1px solid var(--color-border, #1e1e1e)",
          paddingTop: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: "var(--color-text-muted, #a89060)" }}>Base ({eventType})</span>
          <span style={{ color: "var(--color-text-muted, #a89060)" }}>${base}</span>
        </div>
        {gearCost > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: "var(--color-text-muted, #a89060)" }}>Gear</span>
            <span style={{ color: "var(--color-text-muted, #a89060)" }}>${gearCost}</span>
          </div>
        )}
        {overtimeCost > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: "var(--color-text-muted, #a89060)" }}>Overtime ({overtimeHours}h)</span>
            <span style={{ color: "var(--color-text-muted, #a89060)" }}>${overtimeCost}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
          <span style={{ color: "var(--color-text, #e8e8e8)" }}>Estimated Total</span>
          <span style={{ color: "var(--color-magenta, #cc2478)" }}>${subtotal}</span>
        </div>
      </div>

      <p style={{ color: "#444", fontSize: 11, marginBottom: 20, lineHeight: 1.5 }}>
        Estimate only. Final pricing confirmed during your consult call.
      </p>

      <button
        onClick={buildQuoteEmail}
        disabled={selectedItems.length === 0}
        style={{
          width: "100%",
          padding: "14px",
          background: selectedItems.length === 0 ? "var(--color-bg, #0a0a0a)" : "var(--color-magenta, #cc2478)",
          border: "none",
          borderRadius: 4,
          color: selectedItems.length === 0 ? "#444" : "#fff",
          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
          letterSpacing: "0.1em",
          fontSize: "1rem",
          cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
          minHeight: 48,
        }}
      >
        Request This Build
      </button>
    </div>
  )

  return (
    <div style={{ color: "var(--color-text, #e8e8e8)" }}>
      {/* Options bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "40px",
          background: "var(--color-bg-card, #111)",
          border: "1px solid var(--color-border, #1e1e1e)",
          borderRadius: 8,
          padding: "20px 24px",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ color: "var(--color-text-muted, #a89060)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            Event Type
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            {(["standard", "wedding"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEventType(t)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 4,
                  border: `1px solid ${eventType === t ? "var(--color-magenta, #cc2478)" : "var(--color-border, #1e1e1e)"}`,
                  background: eventType === t ? "var(--color-magenta, #cc2478)" : "var(--color-bg, #0a0a0a)",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  minHeight: 44,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ color: "var(--color-text-muted, #a89060)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            Duration — {hours} hour{hours !== 1 ? "s" : ""}
            {hours > INCLUDED_HOURS && (
              <span style={{ color: "var(--color-magenta, #cc2478)", marginLeft: "8px" }}>
                +{hours - INCLUDED_HOURS}h overtime
              </span>
            )}
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--color-magenta, #cc2478)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", color: "#444", fontSize: "11px" }}>
            <span>1h</span>
            <span style={{ color: "var(--color-text-muted, #a89060)" }}>4h included</span>
            <span>12h</span>
          </div>
        </div>
      </div>

      {/* Catalog + Quote layout */}
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: mobile ? "wrap" : "nowrap" }}>
        {/* Gear catalog */}
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          {CATEGORIES.map((cat) => {
            const items = CATALOG.filter((i) => i.category === cat)
            return (
              <div key={cat} style={{ marginBottom: "36px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                    color: "var(--color-gold, #d4af37)",
                    fontSize: "1rem",
                    letterSpacing: "0.12em",
                    marginBottom: "16px",
                    borderBottom: "1px solid var(--color-border, #1e1e1e)",
                    paddingBottom: "10px",
                    textShadow: "0 0 12px rgba(212,175,55,0.35)",
                  }}
                >
                  {cat}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: mobile
                      ? "repeat(2, 1fr)"
                      : "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {items.map((item) => {
                    const qty = selection[item.id] || 0
                    const active = qty > 0
                    return (
                      <div
                        key={item.id}
                        style={{
                          background: active ? "#0d0008" : "var(--color-bg-card, #111)",
                          border: `1px solid ${active ? "var(--color-magenta, #cc2478)" : "var(--color-border, #1e1e1e)"}`,
                          borderRadius: 8,
                          padding: "16px",
                          transition: "all 0.2s",
                        }}
                      >
                        <GearImageSlot name={item.name} active={active} />

                        <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{item.name}</p>
                        <p
                          style={{
                            color: "var(--color-text-muted, #a89060)",
                            fontSize: "12px",
                            marginBottom: item.note ? "4px" : "12px",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.desc}
                        </p>
                        {item.note && (
                          <p style={{ color: "var(--color-magenta, #cc2478)", fontSize: "11px", marginBottom: "12px" }}>
                            {item.note}
                          </p>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                          <QtyControl qty={qty} max={item.maxQty} onChange={(n) => setQty(item.id, n)} />
                          <span style={{ color: active ? "var(--color-magenta, #cc2478)" : "#333", fontSize: "13px", fontWeight: 600 }}>
                            ${item.priceEach}/ea
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quote — sticky sidebar on desktop, bottom sheet toggle on mobile */}
        {!mobile && quoteSidebar}
      </div>

      {/* Mobile: floating quote button + bottom sheet */}
      {mobile && (
        <>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              padding: "12px 16px",
              background: "rgba(0,0,0,0.95)",
              borderTop: "1px solid var(--color-border, #1e1e1e)",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setQuoteOpen((o) => !o)}
              style={{
                flex: 1,
                padding: "14px",
                background: "var(--color-bg-card, #111)",
                border: "1px solid var(--color-border, #1e1e1e)",
                borderRadius: 4,
                color: "var(--color-text, #e8e8e8)",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              {quoteOpen ? "Hide Quote" : `Your Build — $${subtotal}`}
            </button>
            <button
              onClick={buildQuoteEmail}
              disabled={selectedItems.length === 0}
              style={{
                flex: 1,
                padding: "14px",
                background: selectedItems.length === 0 ? "var(--color-bg, #0a0a0a)" : "var(--color-magenta, #cc2478)",
                border: "none",
                borderRadius: 4,
                color: selectedItems.length === 0 ? "#444" : "#fff",
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                letterSpacing: "0.1em",
                fontSize: "1rem",
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Request Build
            </button>
          </div>

          {/* Bottom sheet */}
          {quoteOpen && (
            <div
              style={{
                position: "fixed",
                bottom: 72,
                left: 0,
                right: 0,
                zIndex: 49,
                maxHeight: "60vh",
                overflowY: "auto",
                padding: "0 16px 16px",
                background: "rgba(0,0,0,0.97)",
                borderTop: "1px solid var(--color-border, #1e1e1e)",
              }}
            >
              <div style={{ paddingTop: 16 }}>{quoteSidebar}</div>
            </div>
          )}

          {/* Spacer so last catalog item isn't hidden behind fixed bar */}
          <div style={{ height: 80 }} />
        </>
      )}
    </div>
  )
}
