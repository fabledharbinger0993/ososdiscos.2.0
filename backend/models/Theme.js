import mongoose from "mongoose"

const themeSchema = new mongoose.Schema({
  colors: {
    bg:        { type: String, default: "#0a0a0a" },
    bgDark:    { type: String, default: "#000000" },
    bgCard:    { type: String, default: "#111111" },
    border:    { type: String, default: "#1e1e1e" },
    text:      { type: String, default: "#e8e8e8" },
    textMuted: { type: String, default: "#a89060" },
    gold:      { type: String, default: "#d4af37" },
    magenta:   { type: String, default: "#cc2478" },
    teal:      { type: String, default: "#00c6a2" },
  },
  fonts: {
    display: { type: String, default: "Bebas Neue" },
    body:    { type: String, default: "Inter" },
    accent:  { type: String, default: "Playfair Display" },
  },
})

export default mongoose.model("Theme", themeSchema)
