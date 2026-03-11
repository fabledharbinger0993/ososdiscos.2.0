export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#000",
        borderBottom: "1px solid #1e1e1e",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <a href="/" style={{ textDecoration: "none" }}>
        <h2 style={{ color: "#ff2d95", margin: 0, fontSize: "22px", letterSpacing: "1px" }}>
          OSOS DISCOS
        </h2>
      </a>

      <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <a href="#soundcloud" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>
          Music
        </a>
        <a href="#twitch" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>
          Live
        </a>
        <a href="#bio" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>
          About
        </a>
        <a href="#calendar" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>
          Events
        </a>
        <a href="/gear" style={{ color: "#ccc", textDecoration: "none", fontSize: "14px" }}>
          Rent Gear
        </a>
        <a
          href="/booking"
          style={{
            padding: "8px 20px",
            background: "#ff2d95",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "18px",
            fontSize: "14px",
          }}
        >
          Book Now
        </a>
      </nav>
    </header>
  )
}
