import Header from "../components/Header"
import GearBuilder from "../components/GearBuilder"

export default function GearPage() {
  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      backgroundImage: "url('/bg-wall.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundAttachment: "fixed",
    }}>
      {/* Dark overlay so text stays readable over bg texture */}
      <div style={{ background: "rgba(0,0,0,0.82)", minHeight: "100vh" }}>
        <Header />

        <div style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)" }}>
          {/* Bead divider above heading */}
          <div className="bead-divider" style={{ marginBottom: 32 }} />

          <h1 style={{
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            color: "var(--color-gold, #d4af37)",
            letterSpacing: "0.06em",
            marginBottom: 8,
            textShadow: "0 0 20px rgba(212,175,55,0.5), 0 0 60px rgba(212,175,55,0.2)",
          }}>
            Audio &amp; Gear Rental
          </h1>

          <p style={{
            color: "var(--color-text-muted, #a89060)",
            fontSize: "clamp(13px, 1.6vw, 15px)",
            marginBottom: 48,
            maxWidth: 560,
            lineHeight: 1.6,
          }}>
            Build your setup below. Select gear packages, set your duration, and request a quote —
            all pricing is finalized during your consult call.
          </p>

          {/* Bead divider below intro */}
          <div className="bead-divider" style={{ marginBottom: 48 }} />

          <GearBuilder />

          {/* Bead divider at bottom */}
          <div className="bead-divider" style={{ marginTop: 64 }} />
        </div>
      </div>
    </div>
  )
}
