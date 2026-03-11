import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type BioData = {
  name: string
  tagline: string
  bio: string[]
  photos: { url: string; caption: string }[]
  videos: { url: string; title: string }[]
}

const DEFAULT: BioData = {
  name: "Osos Discos",
  tagline: "House · Disco · Live Events",
  bio: [
    "Osos Discos brings high-energy house and disco sets to festivals, weddings, club nights, and private events.",
    "Available for bookings worldwide. Audio gear rental also available.",
  ],
  photos: [],
  videos: [],
}

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function Bio() {
  const [data, setData] = useState<BioData>(DEFAULT)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/bio`).then((res) => setData(res.data)).catch(() => {})
  }, [])

  return (
    <section
      id="bio"
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
          color: "var(--color-magenta, #cc2478)",
          letterSpacing: "0.06em",
          marginBottom: mobile ? 20 : 24,
          textShadow: "0 0 16px rgba(204,36,120,0.4)",
        }}
      >
        About the DJ
      </h2>

      {/* Two-column on desktop, stacked on mobile */}
      <div
        style={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          gap: mobile ? 28 : 40,
          alignItems: mobile ? "center" : "flex-start",
        }}
      >
        {/* Avatar */}
        {data.photos.length > 0 ? (
          <img
            src={data.photos[0].url}
            alt={data.photos[0].caption || data.name}
            style={{
              width: mobile ? 140 : 200,
              height: mobile ? 140 : 200,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--color-magenta, #cc2478)",
              flexShrink: 0,
              boxShadow: "0 0 24px rgba(204,36,120,0.3)",
            }}
          />
        ) : (
          <div
            style={{
              width: mobile ? 140 : 200,
              height: mobile ? 140 : 200,
              borderRadius: "50%",
              background: "var(--color-bg-card, #111)",
              border: "3px solid var(--color-magenta, #cc2478)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              boxShadow: "0 0 24px rgba(204,36,120,0.2)",
            }}
          >
            🎧
          </div>
        )}

        {/* Bio text card */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: "var(--color-bg-card, #111)",
            border: "1px solid var(--color-border, #1e1e1e)",
            borderRadius: 8,
            padding: mobile ? "24px 20px" : "32px",
            width: mobile ? "100%" : undefined,
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: mobile ? "1.6rem" : "2rem",
              letterSpacing: "0.05em",
              marginBottom: 6,
            }}
          >
            {data.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-accent, 'Playfair Display', serif)",
              fontStyle: "italic",
              color: "var(--color-magenta, #cc2478)",
              marginBottom: 16,
              fontSize: mobile ? "0.9rem" : "1rem",
            }}
          >
            {data.tagline}
          </p>

          {data.bio.map((para, i) => (
            <p
              key={i}
              style={{
                color: "var(--color-text-muted, #a89060)",
                lineHeight: 1.7,
                marginBottom: 14,
                fontSize: mobile ? "0.9rem" : "1rem",
              }}
            >
              {para}
            </p>
          ))}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a
              href="#soundcloud"
              style={{
                padding: mobile ? "10px 20px" : "10px 24px",
                background: "var(--color-magenta, #cc2478)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 4,
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: mobile ? "0.95rem" : "1rem",
                letterSpacing: "0.08em",
                minWidth: 44,
                textAlign: "center",
              }}
            >
              LISTEN
            </a>
            <a
              href="/booking"
              style={{
                padding: mobile ? "10px 20px" : "10px 24px",
                border: "1px solid var(--color-magenta, #cc2478)",
                color: "var(--color-magenta, #cc2478)",
                textDecoration: "none",
                borderRadius: 4,
                fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
                fontSize: mobile ? "0.95rem" : "1rem",
                letterSpacing: "0.08em",
                minWidth: 44,
                textAlign: "center",
              }}
            >
              BOOK NOW
            </a>
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      {data.photos.length > 1 && (
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              color: "var(--color-magenta, #cc2478)",
              fontSize: "1.4rem",
              letterSpacing: "0.06em",
              marginBottom: 20,
            }}
          >
            Photos
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {data.photos.slice(1).map((photo, i) => (
              <div
                key={i}
                style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-border, #1e1e1e)" }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || ""}
                  style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                />
                {photo.caption && (
                  <p
                    style={{
                      padding: "8px 12px",
                      color: "var(--color-text-muted, #a89060)",
                      fontSize: 12,
                      margin: 0,
                      background: "var(--color-bg-card, #111)",
                      fontFamily: "var(--font-accent, 'Playfair Display', serif)",
                      fontStyle: "italic",
                    }}
                  >
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video embeds */}
      {data.videos.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              color: "var(--color-magenta, #cc2478)",
              fontSize: "1.4rem",
              letterSpacing: "0.06em",
              marginBottom: 20,
            }}
          >
            Videos
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {data.videos.map((vid, i) => {
              const embed = youtubeEmbedUrl(vid.url)
              return (
                <div key={i}>
                  {embed ? (
                    <div
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid var(--color-border, #1e1e1e)",
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                      }}
                    >
                      <iframe
                        src={embed}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        allowFullScreen
                        title={vid.title || "Video"}
                      />
                    </div>
                  ) : (
                    <a
                      href={vid.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        padding: 16,
                        background: "var(--color-bg-card, #111)",
                        border: "1px solid var(--color-border, #1e1e1e)",
                        borderRadius: 8,
                        color: "var(--color-magenta, #cc2478)",
                        textDecoration: "none",
                      }}
                    >
                      {vid.title || vid.url}
                    </a>
                  )}
                  {vid.title && (
                    <p
                      style={{
                        color: "var(--color-text-muted, #a89060)",
                        fontSize: 13,
                        marginTop: 8,
                        paddingLeft: 4,
                        fontFamily: "var(--font-accent, 'Playfair Display', serif)",
                        fontStyle: "italic",
                      }}
                    >
                      {vid.title}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
