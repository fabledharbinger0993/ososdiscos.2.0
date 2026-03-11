import { useEffect, useState } from "react"

export default function SoundSection() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section
      id="soundcloud"
      style={{
        padding: mobile ? "48px 16px" : "60px 40px",
        background: "var(--color-bg, #0a0a0a)",
        color: "var(--color-text, #e8e8e8)",
      }}
    >
      {/* Bead divider above */}
      <div className="bead-divider" style={{ marginBottom: mobile ? 28 : 36 }} />

      <h2
        style={{
          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
          fontSize: mobile ? "2rem" : "2.5rem",
          color: "var(--color-gold, #d4af37)",
          letterSpacing: "0.06em",
          marginBottom: mobile ? 20 : 24,
          textShadow: "0 0 16px rgba(212,175,55,0.4)",
        }}
      >
        Live Music
      </h2>

      <div
        style={{
          border: "1px solid var(--color-border, #1e1e1e)",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 0 24px rgba(212,175,55,0.06)",
        }}
      >
        <iframe
          width="100%"
          height={mobile ? 166 : 300}
          style={{ display: "block", border: "none" }}
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/3207&color=%23d4af37&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true"
          title="SoundCloud player"
        />
      </div>

      {/* Bead divider below */}
      <div className="bead-divider" style={{ marginTop: mobile ? 28 : 36 }} />
    </section>
  )
}
