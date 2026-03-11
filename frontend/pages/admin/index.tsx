import { useEffect, useState } from "react"
import axios from "axios"

import Header from "../../components/Header"
import Hero from "../../components/HeroCarousel"
import MovieReel from "../../components/MovieReel"
import SoundSection from "../../components/SoundSection"
import PictureCarousel from "../../components/PictureCarousel"
import EventFlyers from "../../components/EventFlyers"
import Bio from "../../components/BioPanel"
import EventCalendar from "../../components/EventCalendar"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ososdiscoscom-production.up.railway.app"

const DEFAULT_LAYOUT = [
  { type: "hero",     order: 1 },
  { type: "sound",    order: 2 },
  { type: "movies",   order: 3 },
  { type: "pictures", order: 4 },
  { type: "events",   order: 5 },
  { type: "bio",      order: 6 },
  { type: "calendar", order: 7 },
]

type Section = { type: string; order: number }

export default function Home() {
  const [layout, setLayout] = useState<Section[]>(DEFAULT_LAYOUT)

  useEffect(() => {
    axios
      .get(`${API_URL}/api/layout/home`)
      .then((res) => {
        if (res.data.sections?.length) setLayout(res.data.sections)
      })
      .catch(() => {})
  }, [])

  const renderSection = (type: string) => {
    switch (type) {
      case "hero":     return <Hero />
      case "sound":    return <SoundSection />
      case "movies":   return <MovieReel />
      case "pictures": return <PictureCarousel />
      case "events":   return <EventFlyers />
      case "bio":      return <Bio />
      case "calendar": return <EventCalendar />
      default:         return null
    }
  }

  return (
    <div>
      <Header />
      {layout
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.type}>
            {renderSection(section.type)}
          </div>
        ))}
    </div>
  )
}
