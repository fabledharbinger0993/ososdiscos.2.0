import mongoose from "mongoose"

export default mongoose.model("User", {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: "admin" },
})
