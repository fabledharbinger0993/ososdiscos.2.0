import express from "express"
import Layout from "../models/Layout.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// FIX: default sections now match frontend DEFAULT_LAYOUT exactly (was missing
// movies, pictures, and events — those sections would never render on first load)
const DEFAULT_SECTIONS = [
  { type: "hero",     order: 1 },
  { type: "sound",    order: 2 },
  { type: "movies",   order: 3 },
  { type: "pictures", order: 4 },
  { type: "events",   order: 5 },
  { type: "bio",      order: 6 },
  { type: "calendar", order: 7 },
]

router.get("/:page", async (req, res) => {
  try {
    let layout = await Layout.findOne({ page: req.params.page })
    if (!layout) {
      layout = await Layout.create({
        page: req.params.page,
        sections: DEFAULT_SECTIONS,
      })
    }
    res.json(layout)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put("/:page", auth, async (req, res) => {
  try {
    const layout = await Layout.findOneAndUpdate(
      { page: req.params.page },
      { sections: req.body.sections },
      { new: true, upsert: true }
    )
    res.json(layout)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
