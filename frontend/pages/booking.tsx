import Header from "../components/Header"
import BookingForm from "../components/BookingForm"

export default function BookingPage() {
  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      backgroundImage: "url('/bg-wall.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundAttachment: "fixed",
    }}>
      {/* Dark overlay */}
      <div style={{ background: "rgba(0,0,0,0.82)", minHeight: "100vh" }}>
        <Header />

        <div style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)" }}>
          {/* Bead divider above */}
          <div className="bead-divider" style={{ marginBottom: 32 }} />

          <h1 style={{
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            color: "var(--color-magenta, #cc2478)",
            letterSpacing: "0.06em",
            marginBottom: 8,
            textShadow: "0 0 20px rgba(204,36,120,0.5), 0 0 60px rgba(204,36,120,0.2)",
          }}>
            Book Your Event
          </h1>

          <p style={{
            color: "var(--color-text-muted, #a89060)",
            fontSize: "clamp(13px, 1.6vw, 15px)",
            marginBottom: 48,
            maxWidth: 560,
            lineHeight: 1.6,
          }}>
            Every booking starts with a complimentary consult call. Fill out the form below and
            we'll be in touch within 48 hours.
          </p>

          {/* Bead divider */}
          <div className="bead-divider" style={{ marginBottom: 48 }} />

          <BookingForm />

          {/* Bead divider at bottom */}
          <div className="bead-divider" style={{ marginTop: 64 }} />
        </div>
      </div>
    </div>
  )
}
