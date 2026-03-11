import { useEffect } from "react"
import { THEME, applyTheme } from "../styles/theme"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function useTheme() {
  useEffect(() => {
    // Apply defaults immediately so there's no flash of unstyled content
    applyTheme(THEME.colors as Record<string, string>, THEME.fonts)

    // Then fetch the saved theme from the DB and override
    fetch(`${API_URL}/api/theme`)
      .then(r => r.json())
      .then(data => {
        if (data.colors) applyTheme(data.colors, data.fonts ?? {})
      })
      .catch(() => {
        // Network error — defaults already applied, no action needed
      })
  }, [])
}
