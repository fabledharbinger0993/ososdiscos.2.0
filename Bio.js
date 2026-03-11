import express from "express"
import Bio from "../models/Bio.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Public — frontend reads bio content
router.get("/", async (req, res) => {
  try {
    let bio = await Bio.findOne()
    if (!bio) bio = await Bio.create({})
    res.json(bio)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Protected — admin updates bio content
router.put("/", auth, async (req, res) => {
  try {
    let bio = await Bio.findOne()
    if (!bio) {
      bio = await Bio.create(req.body)
    } else {
      const { name, tagline, bio: bioText, photos, videos } = req.body
      if (name !== undefined)    bio.name    = name
      if (tagline !== undefined) bio.tagline = tagline
      if (bioText !== undefined) bio.bio     = bioText
      if (photos !== undefined)  bio.photos  = photos
      if (videos !== undefined)  bio.videos  = videos
      await bio.save()
    }
    res.json(bio)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
