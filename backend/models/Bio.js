import mongoose from "mongoose"

const bioSchema = new mongoose.Schema({
  name:    { type: String, default: "Osos Discos" },
  tagline: { type: String, default: "Festival DJ Experience" },
  bio:     { type: String, default: "" },
  photos:  { type: [String], default: [] },
  videos:  { type: [String], default: [] },
})

export default mongoose.model("Bio", bioSchema)
