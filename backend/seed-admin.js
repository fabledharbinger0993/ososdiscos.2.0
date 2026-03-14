/**
 * One-time admin user seed script.
 *
 * Usage:
 *   node seed-admin.js                          # uses defaults below
 *   node seed-admin.js myuser mysecretpassword   # custom credentials
 *
 * Run from the /backend directory with your .env file present.
 */

import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error("❌  MONGO_URI is not set — add it to backend/.env first")
  process.exit(1)
}

// ── Credentials — override via CLI args ───────────────────────────────────────
const username = process.argv[2] || "admin"
const password = process.argv[3] || "ososdiscos2025"

// ── Minimal User schema (mirrors models/User.js) ──────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: "admin" },
})
const User = mongoose.model("User", userSchema)

async function main() {
  console.log("Connecting to MongoDB…")
  await mongoose.connect(MONGO_URI)
  console.log("✅ Connected")

  const existing = await User.findOne({ username })
  if (existing) {
    console.log(`⚠️  User "${username}" already exists — updating password.`)
    existing.password = await bcrypt.hash(password, 12)
    await existing.save({ validateBeforeSave: false })
    // bypass pre-save hook since we're setting hash directly
    await User.updateOne({ _id: existing._id }, { password: await bcrypt.hash(password, 12) })
    console.log(`✅ Password updated for "${username}"`)
  } else {
    const hashed = await bcrypt.hash(password, 12)
    await User.create({ username, password: hashed, role: "admin" })
    console.log(`✅ Admin user "${username}" created`)
  }

  console.log(`\n  Username : ${username}`)
  console.log(`  Password : ${password}\n`)
  await mongoose.disconnect()
}

main().catch(err => {
  console.error("❌ Seed failed:", err.message)
  process.exit(1)
})
