import mongoose from "mongoose"

export default mongoose.model("Bio", {
  name:    { type: String, default: "Osos Discos" },
  tagline: { type: String, default: "House · Disco · Live Events" },
  bio:     { type: [String], default: [
    "Osos Discos brings high-energy house and disco sets to festivals, weddings, club nights, and private events.",
    "Available for bookings worldwide. Audio gear rental also available.",
  ]},
  photos: [{ url: String, caption: String }],
  videos: [{ url: String, title: String }],
})
