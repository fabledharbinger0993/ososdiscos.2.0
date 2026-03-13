import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"

// ── Route imports ─────────────────────────────────────────────────────────────
import loginRouter    from "./routes/login.js"
import themeRouter    from "./routes/theme.js"
import bioRouter      from "./middleware/Bio.js"
import layoutRouter   from "./modules/Layout.js"
import mediaRouter    from "./modules/Media.js"
import settingsRouter from "./routes/settings.js"

// ── Startup warnings (non-fatal — server still starts so healthcheck passes) ──
if (!process.env.JWT_SECRET) console.warn("⚠️  JWT_SECRET is not set — login will not work")
if (!process.env.MONGO_URI)  console.warn("⚠️  MONGO_URI is not set — database unavailable")

// ── Readiness flag ────────────────────────────────────────────────────────────
let mongoReady = false

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : []),
]

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

app.options("*", cors())
app.use(express.json())

// ── Health endpoint (always 200 — Railway only checks the status code) ────────
app.get("/api/health", (_req, res) =>
  res.status(200).json({ status: "ok", mongo: mongoReady })
)

// ── Readiness gate — returns 503 until MongoDB is connected ───────────────────
app.use((req, res, next) => {
  if (!mongoReady) {
    return res.status(503).json({ error: "Database not ready — please retry shortly" })
  }
  next()
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth/login", loginRouter)
app.use("/api/theme",      themeRouter)
app.use("/api/bio",        bioRouter)
app.use("/api/layout",     layoutRouter)
app.use("/api/media",      mediaRouter)
app.use("/api/settings",   settingsRouter)

// ── 404 + error handlers ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Not found" }))
app.use((err, req, res, _next) => {
  console.error(err.message)
  res.status(500).json({ error: err.message })
})

// ── Start listening IMMEDIATELY so Railway healthcheck can reach the port ─────
const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`)
})

// ── Connect MongoDB asynchronously (routes gate on mongoReady flag) ───────────
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize:              10,
    minPoolSize:              1,
    maxIdleTimeMS:            10000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS:          45000,
  })
    .then(() => {
      mongoReady = true
      console.log("✅ MongoDB connected")
    })
    .catch(err => {
      console.error("❌ MongoDB connection failed:", err.message)
      // Don't exit — healthcheck still passes; Railway will log the error
    })
} else {
  console.warn("⚠️  Skipping MongoDB connection (MONGO_URI not set)")
}
