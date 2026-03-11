import mongoose from "mongoose"

const sectionSchema = new mongoose.Schema({
  type:  { type: String, required: true },
  order: { type: Number, required: true },
}, { _id: false })

const layoutSchema = new mongoose.Schema({
  page:     { type: String, required: true, unique: true },
  sections: { type: [sectionSchema], default: [] },
})

export default mongoose.model("Layout", layoutSchema)
