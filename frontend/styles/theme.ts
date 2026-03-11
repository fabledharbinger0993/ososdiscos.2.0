// Default values — these are overridden at runtime by the theme fetched from the API.
// Components reference CSS custom properties (var(--color-gold) etc.) so admin theme
// changes take effect immediately without a rebuild.

export const THEME = {
  colors: {
    bg:        "#0a0a0a",
    bgDark:    "#000000",
    bgCard:    "#111111",
    border:    "#1e1e1e",
    text:      "#e8e8e8",
    textMuted: "#a89060",
    gold:      "#d4af37",
    magenta:   "#cc2478",
    teal:      "#00c6a2",
    glowGold:  "rgba(212,175,55,0.25)",
    glowPink:  "rgba(204,36,120,0.25)",
  },
  fonts: {
    display: "'Bebas Neue', 'Arial Narrow', sans-serif",
    body:    "'Inter', 'Helvetica Neue', sans-serif",
    accent:  "'Playfair Display', Georgia, serif",
  },
  radius: "12px",
  gap:    "16px",
}

// Helper to apply theme as CSS custom properties on <html>
export function applyTheme(colors: Record<string, string>, fonts: Record<string, string>) {
  const root = document.documentElement
  Object.entries(colors).forEach(([k, v]) => root.style.setProperty(`--color-${k}`, v))
  Object.entries(fonts).forEach(([k, v])  => root.style.setProperty(`--font-${k}`, v))
}

export const cardStyle = (overrides = {}) => ({
  background:   "var(--color-bgCard, #111)",
  border:       "1px solid var(--color-border, #1e1e1e)",
  borderRadius: THEME.radius,
  padding:      "28px",
  ...overrides,
})

export const carouselContainerStyle = {
  position:     "relative" as const,
  borderRadius: THEME.radius,
  overflow:     "hidden",
  border:       "1px solid var(--color-border, #1e1e1e)",
}
