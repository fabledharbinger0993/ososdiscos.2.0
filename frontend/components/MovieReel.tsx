import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type Movie = { url: string; title: string }

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function MovieReel() {
  const [movies, setMovies] = useState<Movie[]>([])
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
    axios.get(`${API_URL}/api/media/movies`).then((res) => setMovies(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return
    const timer = setInterval(() => setCurrent((p) => (p + 1) % movies.length), 5000)
    return () => clearInterval(timer)
  }, [autoPlay, movies.length])

  if (movies.length === 0) return null

  const movie = movies[current]
  const embedUrl = youtubeEmbedUrl(movie.url)

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
        Live Reels
      </h2>

      {/* Aspect-ratio wrapper — no fixed height */}
      <div
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--color-border, #1e1e1e)",
          paddingBottom: "56.25%", // 16:9
          height: 0,
        }}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allowFullScreen
            title={movie.title || "Video"}
          />
        ) : (
          <video
            src={movie.url}
            controls
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Controls below the video */}
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
          onClick={() => setCurrent((p) => (p - 1 + movies.length) % movies.length)}
          style={{
            background: "var(--color-bg-card, #111)",
            border: "1px solid var(--color-border, #1e1e1e)",
            color: "var(--color-text, #e8e8e8)",
            padding: mobile ? "10px 16px" : "8px 16px",
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
          {current + 1} / {movies.length}
        </span>

        <button
          onClick={() => setCurrent((p) => (p + 1) % movies.length)}
          style={{
            background: "var(--color-bg-card, #111)",
            border: "1px solid var(--color-border, #1e1e1e)",
            color: "var(--color-text, #e8e8e8)",
            padding: mobile ? "10px 16px" : "8px 16px",
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
            padding: "8px 16px",
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

      {movie.title && (
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted, #a89060)",
            fontSize: 13,
            marginTop: 8,
            fontFamily: "var(--font-accent, 'Playfair Display', serif)",
            fontStyle: "italic",
          }}
        >
          {movie.title}
        </p>
      )}
    </section>
  )
}
