import mongoose from "mongoose"

export default mongoose.model("Layout", {
  page: String,
  sections: [{
    type:     String,
    settings: Object,
    order:    Number,
  }],
})
