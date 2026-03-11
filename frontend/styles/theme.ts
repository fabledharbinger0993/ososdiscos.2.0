export const THEME = {
  colors: {
    bg: "#0a0a0a",
    bgDark: "#000",
    bgCard: "#111",
    border: "#1e1e1e",
    text: "#d4d4d4",
    textMuted: "#c09b0a",
    accent: "#00c6a2",
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
