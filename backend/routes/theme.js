import express from "express"
import Theme from "../models/Theme.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    let theme = await Theme.findOne()
    if (!theme) theme = await Theme.create({})
    res.json(theme)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put("/", auth, async (req, res) => {
  try {
    let theme = await Theme.findOne()
    if (!theme) {
      theme = await Theme.create(req.body)
    } else {
      if (req.body.colors) Object.assign(theme.colors, req.body.colors)
      if (req.body.fonts)  Object.assign(theme.fonts, req.body.fonts)
      theme.markModified("colors")
      theme.markModified("fonts")
      await theme.save()
    }
    res.json(theme)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
