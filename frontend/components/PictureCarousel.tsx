import { useState, useEffect } from "react"
import axios from "axios"
import { THEME, carouselContainerStyle } from "../styles/theme"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type Picture = { url: string; caption: string }

export default function PictureCarousel() {
  const [pictures, setPictures] = useState<Picture[]>([])
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

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
    <section style={{ padding: "60px 40px", background: THEME.colors.bg, color: THEME.colors.text }}>
      <h2 style={{ color: THEME.colors.accent, fontSize: "36px", marginBottom: "24px" }}>
        Gallery
      </h2>

      <div style={carouselContainerStyle}>
        <img
          src={picture.url}
          alt={picture.caption}
          style={{ width: "100%", height: "500px", objectFit: "cover", display: "block" }}
        />

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setCurrent((p) => (p - 1 + pictures.length) % pictures.length)}
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
             Prev
          </button>

          <span style={{ color: THEME.colors.textMuted, fontSize: "12px" }}>
            {current + 1} / {pictures.length}
          </span>

          <button
            onClick={() => setCurrent((p) => (p + 1) % pictures.length)}
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Next 
          </button>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              background: autoPlay ? THEME.colors.accent : "rgba(0,0,0,0.6)",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {autoPlay ? "" : ""}
          </button>
        </div>

        {picture.caption && (
          <p
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              margin: 0,
              color: THEME.colors.textMuted,
              fontSize: "12px",
              background: "rgba(0,0,0,0.6)",
              padding: "4px 12px",
              borderRadius: "8px",
            }}
          >
            {picture.caption}
          </p>
        )}
      </div>
    </section>
  )
}
