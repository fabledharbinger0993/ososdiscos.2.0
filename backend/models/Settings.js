import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
  phone_video_url:  { type: String, default: "" },
  soundcloud_url:   { type: String, default: "" },
  twitch_channel:   { type: String, default: "" },
  live_mode:        { type: Boolean, default: false },
  polaroid_photos:  [{ type: String }],
  emailjs_service:  { type: String, default: "" },
  emailjs_template: { type: String, default: "" },
  emailjs_key:      { type: String, default: "" },
})

export default mongoose.model("Settings", settingsSchema)
