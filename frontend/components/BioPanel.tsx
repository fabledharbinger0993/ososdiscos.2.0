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

  useEffect(() => {
    axios.get(`${API_URL}/api/bio`).then((res) => setData(res.data)).catch(() => {})
  }, [])

  return (
    <section id="bio" style={{ padding: "60px 40px", background: "#0a0a0a", color: "#fff" }}>
      <h2 style={{ color: "#ff2d95", fontSize: "36px", marginBottom: "24px" }}>About the DJ</h2>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Avatar / first photo */}
        {data.photos.length > 0 ? (
          <img
            src={data.photos[0].url}
            alt={data.photos[0].caption || data.name}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #ff2d95",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "#1a1a1a",
              border: "3px solid #ff2d95",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px",
            }}
          >
            🎧
          </div>
        )}

        {/* Bio text card */}
        <div
          style={{
            flex: 1,
            minWidth: "260px",
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "18px",
            padding: "32px",
          }}
        >
          <h3 style={{ fontSize: "28px", marginBottom: "8px" }}>{data.name}</h3>
          <p style={{ color: "#ff2d95", marginBottom: "16px" }}>{data.tagline}</p>

          {data.bio.map((para, i) => (
            <p key={i} style={{ color: "#ccc", lineHeight: "1.7", marginBottom: "16px" }}>
              {para}
            </p>
          ))}

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
            <a
              href="#soundcloud"
              style={{
                padding: "10px 24px",
                background: "#ff2d95",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "18px",
              }}
            >
              Listen
            </a>
            <a
              href="/booking"
              style={{
                padding: "10px 24px",
                border: "1px solid #ff2d95",
                color: "#ff2d95",
                textDecoration: "none",
                borderRadius: "18px",
              }}
            >
              Book Now
            </a>
          </div>
        </div>
      </div>

      {/* Photo gallery (remaining photos after avatar) */}
      {data.photos.length > 1 && (
        <div style={{ marginTop: "48px" }}>
          <h3 style={{ color: "#ff2d95", fontSize: "20px", marginBottom: "20px" }}>Photos</h3>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {data.photos.slice(1).map((photo, i) => (
              <div key={i} style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid #1e1e1e" }}>
                <img
                  src={photo.url}
                  alt={photo.caption || ""}
                  style={{ width: "220px", height: "160px", objectFit: "cover", display: "block" }}
                />
                {photo.caption && (
                  <p style={{ padding: "8px 12px", color: "#888", fontSize: "12px", margin: 0, background: "#111" }}>
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
        <div style={{ marginTop: "48px" }}>
          <h3 style={{ color: "#ff2d95", fontSize: "20px", marginBottom: "20px" }}>Videos</h3>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {data.videos.map((vid, i) => {
              const embed = youtubeEmbedUrl(vid.url)
              return (
                <div key={i} style={{ flex: "1 1 300px", maxWidth: "480px" }}>
                  {embed ? (
                    <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid #1e1e1e" }}>
                      <iframe
                        width="100%"
                        height="270"
                        src={embed}
                        style={{ display: "block", border: "none" }}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={vid.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        padding: "16px",
                        background: "#111",
                        border: "1px solid #1e1e1e",
                        borderRadius: "18px",
                        color: "#ff2d95",
                        textDecoration: "none",
                      }}
                    >
                      {vid.title || vid.url}
                    </a>
                  )}
                  {vid.title && (
                    <p style={{ color: "#888", fontSize: "13px", marginTop: "8px", paddingLeft: "4px" }}>
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
