import { useState } from "react"

// ── Pricing config (edit these to adjust rates) ───────────────────────────────

const BASE_PRICE = { standard: 200, wedding: 500 }
const INCLUDED_HOURS = 4
const HOURLY_OVERAGE = 50   // per hour beyond INCLUDED_HOURS

// ── Gear catalog ──────────────────────────────────────────────────────────────

type GearItem = {
  id: string
  category: string
  name: string
  desc: string
  note?: string
  maxQty: number
  priceEach: number
  // imageSlot: replace the placeholder div below with <img src={...}> when Canva renders are ready
}

const CATALOG: GearItem[] = [
  // Audio
  { id: "mains",      category: "Audio",    name: "Main Speakers",       desc: "Full-range front-of-house mains",                       maxQty: 4,  priceEach: 60  },
  { id: "subs",       category: "Audio",    name: "Subwoofers",          desc: "Bass reinforcement",                                    maxQty: 4,  priceEach: 50  },
  { id: "monitors",   category: "Audio",    name: "Stage Monitors",      desc: "Wedge monitors (always included for our use)",    maxQty: 2,  priceEach: 35  },
  { id: "mics",       category: "Audio",    name: "Microphones",         desc: "Handheld dynamic mics",                                 maxQty: 2,  priceEach: 30  },
  // DJ Setup
  { id: "booth",      category: "DJ Setup", name: "DJ Booth",            desc: "Professional DJ facade",                                maxQty: 1,  priceEach: 120 },
  { id: "mixer",      category: "DJ Setup", name: "Mixer",               desc: "Professional DJ mixer",                                 maxQty: 1,  priceEach: 80  },
  { id: "cdj",        category: "DJ Setup", name: "CDJ-3000",            desc: "Industry-standard media players",                       maxQty: 2,  priceEach: 75  },
  { id: "controller", category: "DJ Setup", name: "Controller",          desc: "Great for lower-profile events",  note: "Ideal for country clubs & wedding ceremonies", maxQty: 1, priceEach: 60 },
  // Lighting
  { id: "lighttower", category: "Lighting", name: "Party Light Tower",   desc: "Full-effect LED lighting tower",                        maxQty: 1,  priceEach: 100 },
  { id: "parlights",  category: "Lighting", name: "Par Lights",          desc: "LED par cans",                                          maxQty: 10, priceEach: 12  },
  // Shelter
  { id: "tent1010",   category: "Shelter",  name: "10×10 Tent",          desc: "10ft × 10ft canopy",                                    maxQty: 1,  priceEach: 80  },
  { id: "tent1212",   category: "Shelter",  name: "12×12 Tent",          desc: "12ft × 12ft canopy",                                    maxQty: 1,  priceEach: 100 },
  { id: "tentHex",    category: "Shelter",  name: "14ft Hexagon Tent",   desc: "14ft hexagonal canopy",                                 maxQty: 1,  priceEach: 150 },
]

const CATEGORIES = ["Audio", "DJ Setup", "Lighting", "Shelter"]

// ── Sub-components ────────────────────────────────────────────────────────────

// IMAGE SLOT — replace the inner div with <img src="..."> when Canva renders arrive
function GearImageSlot({ name, active }: { name: string; active: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "120px",
        background: active ? "#1a0010" : "#0d0d0d",
        border: `1px dashed ${active ? "#ff2d95" : "#2a2a2a"}`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "12px",
        transition: "all 0.2s",
      }}
    >
      {/* ↓ REPLACE THIS WITH: <img src="/gear-images/{id}.png" alt={name} style={{width:"100%",height:"100%",objectFit:"contain"}} /> */}
      <span style={{ fontSize: "28px", marginBottom: "6px" }}>📦</span>
      <span style={{ color: "#444", fontSize: "11px" }}>Image coming soon</span>
    </div>
  )
}

function QtyControl({
  qty, max, onChange,
}: { qty: number; max: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, qty - 1))}
        disabled={qty === 0}
        style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: qty === 0 ? "#1a1a1a" : "#2e2e2e",
          border: "1px solid #333", color: qty === 0 ? "#444" : "#fff",
          cursor: qty === 0 ? "not-allowed" : "pointer", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        −
      </button>
      <span style={{ color: qty > 0 ? "#fff" : "#444", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty === max}
        style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: qty === max ? "#1a1a1a" : "#ff2d95",
          border: "none", color: "#fff",
          cursor: qty === max ? "not-allowed" : "pointer", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        +
      </button>
      <span style={{ color: "#555", fontSize: "12px" }}>/ {max}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GearBuilder() {
  const [eventType, setEventType] = useState<"standard" | "wedding">("standard")
  const [hours, setHours] = useState(4)
  const [selection, setSelection] = useState<Record<string, number>>({})

  const setQty = (id: string, qty: number) =>
    setSelection((prev) => ({ ...prev, [id]: qty }))

  // ── Price calculation ──────────────────────────────────────────────────────

  const base = BASE_PRICE[eventType]
  const gearCost = CATALOG.reduce(
    (sum, item) => sum + (selection[item.id] || 0) * item.priceEach, 0
  )
  const overtimeHours = Math.max(0, hours - INCLUDED_HOURS)
  const overtimeCost = overtimeHours * HOURLY_OVERAGE
  const subtotal = base + gearCost + overtimeCost
  const selectedItems = CATALOG.filter((item) => (selection[item.id] || 0) > 0)

  // ── Build mailto quote ─────────────────────────────────────────────────────

  const buildQuoteEmail = () => {
    const lines = [
      `GEAR RENTAL QUOTE REQUEST`,
      `Event Type: ${eventType === "wedding" ? "Wedding" : "Standard Event"}`,
      `Duration: ${hours} hour${hours !== 1 ? "s" : ""}`,
      "",
      "Selected Gear:",
      ...selectedItems.map(
        (item) =>
          `  ${item.name} × ${selection[item.id]}  —  $${(selection[item.id] || 0) * item.priceEach}`
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

  return (
    <div style={{ color: "#fff" }}>
      {/* ── Options bar ── */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "40px",
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "18px",
          padding: "20px 24px",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "8px" }}>
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
                  borderRadius: "18px",
                  border: `1px solid ${eventType === t ? "#ff2d95" : "#2e2e2e"}`,
                  background: eventType === t ? "#ff2d95" : "#1a1a1a",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            Duration — {hours} hour{hours !== 1 ? "s" : ""}
            {hours > INCLUDED_HOURS && (
              <span style={{ color: "#ff2d95", marginLeft: "8px" }}>
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
            style={{ width: "100%", accentColor: "#ff2d95" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", color: "#444", fontSize: "11px" }}>
            <span>1h</span>
            <span style={{ color: "#555" }}>4h included</span>
            <span>12h</span>
          </div>
        </div>
      </div>

      {/* ── Catalog + Quote layout ── */}
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Gear catalog */}
        <div style={{ flex: "1 1 420px" }}>
          {CATEGORIES.map((cat) => {
            const items = CATALOG.filter((i) => i.category === cat)
            return (
              <div key={cat} style={{ marginBottom: "36px" }}>
                <h3
                  style={{
                    color: "#ff2d95",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "16px",
                    borderBottom: "1px solid #1e1e1e",
                    paddingBottom: "10px",
                  }}
                >
                  {cat}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
                  {items.map((item) => {
                    const qty = selection[item.id] || 0
                    const active = qty > 0
                    return (
                      <div
                        key={item.id}
                        style={{
                          background: active ? "#0d0008" : "#111",
                          border: `1px solid ${active ? "#ff2d95" : "#1e1e1e"}`,
                          borderRadius: "18px",
                          padding: "16px",
                          transition: "all 0.2s",
                        }}
                      >
                        <GearImageSlot name={item.name} active={active} />

                        <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{item.name}</p>
                        <p style={{ color: "#666", fontSize: "12px", marginBottom: item.note ? "4px" : "12px", lineHeight: "1.4" }}>
                          {item.desc}
                        </p>
                        {item.note && (
                          <p style={{ color: "#ff2d95", fontSize: "11px", marginBottom: "12px" }}>
                            {item.note}
                          </p>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <QtyControl qty={qty} max={item.maxQty} onChange={(n) => setQty(item.id, n)} />
                          <span style={{ color: active ? "#ff2d95" : "#333", fontSize: "13px", fontWeight: 600 }}>
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

        {/* Quote sidebar */}
        <div
          style={{
            width: "280px",
            flexShrink: 0,
            position: "sticky",
            top: "100px",
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h3 style={{ color: "#ff2d95", fontSize: "16px", marginBottom: "20px" }}>Your Build</h3>

          {selectedItems.length === 0 ? (
            <p style={{ color: "#444", fontSize: "13px", marginBottom: "20px" }}>
              Select gear to the left to build your quote.
            </p>
          ) : (
            <div style={{ marginBottom: "20px" }}>
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#ccc" }}>
                    {item.name} <span style={{ color: "#555" }}>×{selection[item.id]}</span>
                  </span>
                  <span style={{ color: "#fff" }}>${(selection[item.id] || 0) * item.priceEach}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
              <span style={{ color: "#666" }}>Base ({eventType})</span>
              <span style={{ color: "#ccc" }}>${base}</span>
            </div>
            {gearCost > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Gear</span>
                <span style={{ color: "#ccc" }}>${gearCost}</span>
              </div>
            )}
            {overtimeCost > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: "#666" }}>Overtime ({overtimeHours}h)</span>
                <span style={{ color: "#ccc" }}>${overtimeCost}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 700, marginTop: "12px" }}>
              <span style={{ color: "#fff" }}>Estimated Total</span>
              <span style={{ color: "#ff2d95" }}>${subtotal}</span>
            </div>
          </div>

          <p style={{ color: "#444", fontSize: "11px", marginBottom: "20px", lineHeight: "1.5" }}>
            Estimate only. Final pricing confirmed during your consult call.
          </p>

          <button
            onClick={buildQuoteEmail}
            disabled={selectedItems.length === 0}
            style={{
              width: "100%",
              padding: "12px",
              background: selectedItems.length === 0 ? "#1a1a1a" : "#ff2d95",
              border: "none",
              borderRadius: "18px",
              color: selectedItems.length === 0 ? "#444" : "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Request This Build
          </button>
        </div>
      </div>
    </div>
  )
}
