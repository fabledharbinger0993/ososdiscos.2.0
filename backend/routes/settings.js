import express from "express"
import Settings from "../models/Settings.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (_req, res) => {
  try {
    let s = await Settings.findOne()
    if (!s) s = await Settings.create({})
    res.json(s)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put("/", auth, async (req, res) => {
  try {
    const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true })
    res.json(s)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
