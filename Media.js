import mongoose from "mongoose"

const mediaSchema = new mongoose.Schema({
  type:      { type: String, enum: ["movie", "picture", "event"], required: true },
  url:       String,
  flyerUrl:  String,
  title:     String,
  caption:   String,
  date:      String,
  venue:     String,
  order:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Media", mediaSchema)
