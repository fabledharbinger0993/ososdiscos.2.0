import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

router.post("/", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" })

  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const valid = await user.verifyPassword(password)
    if (!valid) return res.status(401).json({ error: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    )
    res.json({ token })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
