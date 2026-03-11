export const THEME = {
  colors: {
    bg: "#0a0a0a",
    bgDark: "#000",
    bgCard: "#111",
    border: "#1e1e1e",
    text: "#fff",
    textMuted: "#888",
    accent: "#ff2d95",
    accentDark: "#cc2478",
  },
  radius: "18px",
  gap: "16px",
}

export const cardStyle = (overrides = {}) => ({
  background: THEME.colors.bgCard,
  border: `1px solid ${THEME.colors.border}`,
  borderRadius: THEME.radius,
  padding: "28px",
  ...overrides,
})

export const carouselContainerStyle = {
  position: "relative" as const,
  borderRadius: THEME.radius,
  overflow: "hidden",
  border: `1px solid ${THEME.colors.border}`,
}
