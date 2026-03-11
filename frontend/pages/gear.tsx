import Header from "../components/Header"
import GearBuilder from "../components/GearBuilder"

export default function GearPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "60px 40px" }}>
        <h1 style={{ color: "#ff2d95", fontSize: "36px", marginBottom: "8px" }}>
          Audio & Gear Rental
        </h1>
        <p style={{ color: "#666", fontSize: "15px", marginBottom: "48px", maxWidth: "540px" }}>
          Build your setup below. Select gear packages, set your duration, and request a quote —
          all pricing is finalized during your consult call.
        </p>
        <GearBuilder />
      </div>
    </div>
  )
}
