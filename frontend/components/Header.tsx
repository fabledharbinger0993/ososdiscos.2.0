import { useState, useEffect } from "react"

const NAV_LINKS = [
  { href: "#soundcloud", label: "Music" },
  { href: "#twitch", label: "Live" },
  { href: "#bio", label: "About" },
  { href: "#calendar", label: "Events" },
  { href: "/gear", label: "Rent Gear" },
]

export default function Header() {
  const [mobile, setMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => {
      setMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: mobile ? "16px 20px" : "18px 40px",
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border, #1e1e1e)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: mobile ? "1.4rem" : "1.7rem",
            letterSpacing: "0.08em",
            color: "var(--color-gold, #d4af37)",
            textShadow:
              "0 0 10px rgba(212,175,55,0.7), 0 0 30px rgba(212,175,55,0.3)",
            display: "block",
            lineHeight: 1,
          }}
        >
          OSOS DISCOS
        </span>
      </a>

      {/* Desktop nav */}
      {!mobile && (
        <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "var(--color-text-muted, #a89060)",
                textDecoration: "none",
                fontSize: "13px",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-body, 'Inter', sans-serif)",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text, #e8e8e8)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted, #a89060)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/booking"
            style={{
              padding: "8px 22px",
              background: "transparent",
              border: "1px solid var(--color-magenta, #cc2478)",
              color: "var(--color-magenta, #cc2478)",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "13px",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-magenta, #cc2478)"
              e.currentTarget.style.color = "#fff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "var(--color-magenta, #cc2478)"
            }}
          >
            BOOK NOW
          </a>
        </nav>
      )}

      {/* Hamburger button */}
      {mobile && (
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "var(--color-gold, #d4af37)",
                borderRadius: 2,
                transition: "transform 0.2s, opacity 0.2s",
                transform:
                  menuOpen && i === 0 ? "translateY(7px) rotate(45deg)"
                  : menuOpen && i === 1 ? "scaleX(0)"
                  : menuOpen && i === 2 ? "translateY(-7px) rotate(-45deg)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      )}

      {/* Mobile menu dropdown */}
      {mobile && menuOpen && (
        <nav
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--color-border, #1e1e1e)",
            padding: "16px 0 24px",
            zIndex: 99,
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "14px 24px",
                color: "var(--color-text, #e8e8e8)",
                textDecoration: "none",
                fontSize: "15px",
                fontFamily: "var(--font-body, 'Inter', sans-serif)",
                borderBottom: "1px solid var(--color-border, #1e1e1e)",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ padding: "16px 24px 0" }}>
            <a
              href="/booking"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "14px",
                textAlign: "center",
                background: "var(--color-magenta, #cc2478)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "4px",
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
              }}
            >
              BOOK NOW
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
