import { useState, useEffect } from "react"
import axios from "axios"
import { THEME, carouselContainerStyle } from "../styles/theme"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type Movie = { url: string; title: string }

// FIX: replaces the fragile .replace("watch?v=", "embed/") approach that
// only handled one URL format. This regex handles:
//   https://www.youtube.com/watch?v=ID
//   https://youtu.be/ID
//   https://www.youtube.com/watch?v=ID&other=params
function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function MovieReel() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

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
    <section style={{ padding: "60px 40px", background: THEME.colors.bg, color: THEME.colors.text }}>
      <h2 style={{ color: "var(--color-teal)", fontSize: "36px", marginBottom: "24px" }}>
        Live Reels
      </h2>

      <div style={carouselContainerStyle}>
        {embedUrl ? (
          <iframe
            width="100%"
            height="500"
            src={embedUrl}
            style={{ display: "block", border: "none" }}
            allowFullScreen
          />
        ) : (
          <video
            src={movie.url}
            controls
            style={{ width: "100%", height: "500px", objectFit: "cover", display: "block" }}
          />
        )}

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
            onClick={() => setCurrent((p) => (p - 1 + movies.length) % movies.length)}
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            ← Prev
          </button>

          <span style={{ color: THEME.colors.textMuted, fontSize: "12px" }}>
            {current + 1} / {movies.length}
          </span>

          <button
            onClick={() => setCurrent((p) => (p + 1) % movies.length)}
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Next →
          </button>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              background: autoPlay ? "var(--color-teal)" : "rgba(0,0,0,0.6)",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {autoPlay ? "⏸" : "▶"}
          </button>
        </div>

        <p
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            margin: 0,
            color: THEME.colors.textMuted,
            fontSize: "12px",
          }}
        >
          {movie.title}
        </p>
      </div>
    </section>
  )
}
