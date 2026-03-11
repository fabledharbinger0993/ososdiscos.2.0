import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type Picture = { url: string; caption: string }

export default function PictureCarousel() {
  const [pictures, setPictures] = useState<Picture[]>([])
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/media/pictures`).then((res) => setPictures(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!autoPlay || pictures.length === 0) return
    const timer = setInterval(() => setCurrent((p) => (p + 1) % pictures.length), 4000)
    return () => clearInterval(timer)
  }, [autoPlay, pictures.length])

  if (pictures.length === 0) return null

  const picture = pictures[current]

  return (
    <section
      style={{
        padding: mobile ? "48px 16px" : "60px 40px",
        background: "var(--color-bg, #0a0a0a)",
        color: "var(--color-text, #e8e8e8)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
          fontSize: mobile ? "2rem" : "2.5rem",
          color: "var(--color-teal, #00c6a2)",
          letterSpacing: "0.06em",
          marginBottom: mobile ? 20 : 24,
          textShadow: "0 0 16px rgba(0,198,162,0.4)",
        }}
      >
        Gallery
      </h2>

      {/* Image */}
      <div
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--color-border, #1e1e1e)",
        }}
      >
        <img
          src={picture.url}
          alt={picture.caption}
          style={{
            width: "100%",
            height: mobile ? 260 : 500,
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Caption overlay */}
        {picture.caption && (
          <p
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              margin: 0,
              padding: "24px 16px 12px",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              color: "var(--color-text-muted, #a89060)",
              fontSize: mobile ? 12 : 13,
              fontFamily: "var(--font-accent, 'Playfair Display', serif)",
              fontStyle: "italic",
            }}
          >
            {picture.caption}
          </p>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setCurrent((p) => (p - 1 + pictures.length) % pictures.length)}
          style={{
            background: "var(--color-bg-card, #111)",
            border: "1px solid var(--color-border, #1e1e1e)",
            color: "var(--color-text, #e8e8e8)",
            padding: "10px 16px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          ← Prev
        </button>

        <span style={{ color: "var(--color-text-muted, #a89060)", fontSize: 13, padding: "0 8px" }}>
          {current + 1} / {pictures.length}
        </span>

        <button
          onClick={() => setCurrent((p) => (p + 1) % pictures.length)}
          style={{
            background: "var(--color-bg-card, #111)",
            border: "1px solid var(--color-border, #1e1e1e)",
            color: "var(--color-text, #e8e8e8)",
            padding: "10px 16px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          Next →
        </button>

        <button
          onClick={() => setAutoPlay(!autoPlay)}
          style={{
            background: autoPlay ? "var(--color-teal, #00c6a2)" : "var(--color-bg-card, #111)",
            border: "none",
            color: autoPlay ? "#000" : "var(--color-text, #e8e8e8)",
            padding: "10px 16px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          {autoPlay ? "⏸" : "▶"}
        </button>
      </div>
    </section>
  )
}
