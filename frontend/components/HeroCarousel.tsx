import { useEffect, useState } from "react"
import DiscoBall from "./DiscoBall"

export default function HeroCarousel() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-dark, #000)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: mobile ? "40px 16px 60px" : "60px 32px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scattered background dots — disco floor light effect */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 40%, rgba(212,175,55,0.05) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 60%, rgba(204,36,120,0.05) 0%, transparent 50%), " +
            "radial-gradient(circle at 50% 90%, rgba(0,198,162,0.04) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Disco ball — centered above the marquee */}
      <div style={{ marginBottom: mobile ? 16 : 24, zIndex: 2, position: "relative" }}>
        <DiscoBall size={mobile ? 72 : 120} />
      </div>

      {/* Marquee frame */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: mobile ? 340 : 780,
        }}
      >
        {/* Outer marquee border with bullet lights */}
        <div
          style={{
            border: "3px solid var(--color-gold, #d4af37)",
            borderRadius: 4,
            padding: mobile ? "28px 20px 32px" : "48px 60px 56px",
            position: "relative",
            boxShadow:
              "0 0 30px rgba(212,175,55,0.2), inset 0 0 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Bullet lights — top row */}
          <BulletRow count={mobile ? 7 : 14} top={-9} left={0} right={0} horizontal />
          {/* Bullet lights — bottom row */}
          <BulletRow count={mobile ? 7 : 14} bottom={-9} left={0} right={0} horizontal />
          {/* Bullet lights — left col */}
          <BulletRow count={mobile ? 4 : 7} left={-9} top={0} bottom={0} vertical />
          {/* Bullet lights — right col */}
          <BulletRow count={mobile ? 4 : 7} right={-9} top={0} bottom={0} vertical />

          {/* Corner bulbs */}
          {[
            { top: -9, left: -9 }, { top: -9, right: -9 },
            { bottom: -9, left: -9 }, { bottom: -9, right: -9 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#d4af37",
                boxShadow: "0 0 8px 3px rgba(212,175,55,0.8)",
                animation: `bulbPulse 1.4s ease-in-out ${i * 0.35}s infinite alternate`,
                ...pos,
              }}
            />
          ))}

          {/* Site name — theatrical marquee style */}
          <h1
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: mobile ? "clamp(3rem, 14vw, 4rem)" : "clamp(4rem, 8vw, 7rem)",
              letterSpacing: "0.08em",
              color: "var(--color-gold, #d4af37)",
              textShadow:
                "0 0 20px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4), 0 0 100px rgba(212,175,55,0.2)",
              textAlign: "center",
              margin: 0,
              lineHeight: 1,
            }}
          >
            OSOS DISCOS
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-accent, 'Playfair Display', serif)",
              fontSize: mobile ? "0.85rem" : "1.1rem",
              fontStyle: "italic",
              color: "var(--color-text-muted, #a89060)",
              textAlign: "center",
              marginTop: mobile ? 12 : 20,
              marginBottom: 0,
              letterSpacing: "0.12em",
            }}
          >
            Your celebration deserves a soundtrack
          </p>
        </div>
      </div>

      {/* Portrait illustration — husband & wife flanking the marquee */}
      {!mobile ? (
        <>
          <img
            src="/portraits.png"
            alt="Osos Discos"
            style={{
              position: "absolute",
              bottom: 0,
              left: "calc(50% - 520px)",
              height: 260,
              objectFit: "contain",
              objectPosition: "bottom right",
              width: 220,
              filter: "drop-shadow(0 0 16px rgba(212,175,55,0.3))",
              zIndex: 3,
            }}
          />
          <img
            src="/portraits.png"
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              right: "calc(50% - 520px)",
              height: 260,
              objectFit: "contain",
              objectPosition: "bottom left",
              width: 220,
              transform: "scaleX(-1)",
              filter: "drop-shadow(0 0 16px rgba(212,175,55,0.3))",
              zIndex: 3,
            }}
          />
        </>
      ) : (
        // On mobile: portrait below the marquee, centered
        <img
          src="/portraits.png"
          alt="Osos Discos"
          style={{
            marginTop: 32,
            width: "60%",
            maxWidth: 200,
            objectFit: "contain",
            filter: "drop-shadow(0 0 12px rgba(212,175,55,0.3))",
            zIndex: 3,
          }}
        />
      )}

      {/* Book Now CTA */}
      <div style={{ marginTop: mobile ? 40 : 56, zIndex: 4, position: "relative" }}>
        <a
          href="/booking"
          style={{
            display: "inline-block",
            padding: mobile ? "14px 36px" : "16px 48px",
            background: "transparent",
            border: "2px solid var(--color-teal, #00c6a2)",
            borderRadius: 4,
            color: "var(--color-teal, #00c6a2)",
            fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
            fontSize: mobile ? "1.1rem" : "1.3rem",
            letterSpacing: "0.15em",
            textDecoration: "none",
            boxShadow: "0 0 16px rgba(0,198,162,0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = "var(--color-teal, #00c6a2)"
            el.style.color = "#000"
            el.style.boxShadow = "0 0 28px rgba(0,198,162,0.5)"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = "transparent"
            el.style.color = "var(--color-teal, #00c6a2)"
            el.style.boxShadow = "0 0 16px rgba(0,198,162,0.2)"
          }}
        >
          BOOK YOUR DATE
        </a>
      </div>

      <style>{`
        @keyframes bulbPulse {
          0%   { opacity: 0.4; box-shadow: 0 0 4px 1px rgba(212,175,55,0.4); }
          100% { opacity: 1;   box-shadow: 0 0 12px 5px rgba(212,175,55,0.9); }
        }
      `}</style>
    </section>
  )
}

// --- Bullet light border helpers ---

interface BulletRowProps {
  count: number
  top?: number | string
  bottom?: number | string
  left?: number | string
  right?: number | string
  horizontal?: boolean
  vertical?: boolean
}

function BulletRow({ count, top, bottom, left, right, horizontal, vertical }: BulletRowProps) {
  const bulbs = Array.from({ length: count })

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    pointerEvents: "none",
    ...(horizontal
      ? {
          flexDirection: "row",
          justifyContent: "space-evenly",
          top: top !== undefined ? top : undefined,
          bottom: bottom !== undefined ? bottom : undefined,
          left: left !== undefined ? left : undefined,
          right: right !== undefined ? right : undefined,
          width: "100%",
          padding: "0 14px",
        }
      : {
          flexDirection: "column",
          justifyContent: "space-evenly",
          top: top !== undefined ? top : undefined,
          bottom: bottom !== undefined ? bottom : undefined,
          left: left !== undefined ? left : undefined,
          right: right !== undefined ? right : undefined,
          height: "100%",
          padding: "14px 0",
        }),
  }

  return (
    <div style={containerStyle} aria-hidden>
      {bulbs.map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#d4af37",
            boxShadow: "0 0 6px 2px rgba(212,175,55,0.7)",
            animation: `bulbPulse 1.4s ease-in-out ${(i * 0.18).toFixed(2)}s infinite alternate`,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}
