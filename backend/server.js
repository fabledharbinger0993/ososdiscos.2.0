import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"

// ── Startup guard ────────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env var is not set")
if (!process.env.MONGO_URI)  throw new Error("MONGO_URI env var is not set")

// ── Route imports ─────────────────────────────────────────────────────────────
import loginRouter  from "./routes/login.js"
import themeRouter  from "./routes/theme.js"
import bioRouter    from "./middleware/Bio.js"
import layoutRouter from "./modules/Layout.js"
import mediaRouter  from "./modules/Media.js"

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim()) : []),
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

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth/login", loginRouter)
app.use("/api/theme",      themeRouter)
app.use("/api/bio",        bioRouter)
app.use("/api/layout",     layoutRouter)
app.use("/api/media",      mediaRouter)
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }))

// ── 404 + error handlers ──────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Not found" }))
app.use((err, req, res, _next) => {
  console.error(err.message)
  res.status(500).json({ error: err.message })
})

// ── MongoDB + listen ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize:          10,
  minPoolSize:          1,
  maxIdleTimeMS:        10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:      45000,
}).then(() => {
  console.log("MongoDB connected")
  app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`))
}).catch(err => {
  console.error("MongoDB connection failed:", err.message)
  process.exit(1)
})
