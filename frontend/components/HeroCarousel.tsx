export default function HeroCarousel() {
  return (
    // FIX: added background color — without it the section renders transparent/white
    // FIX: cleaned up minified formatting (was all on one line, hard to maintain)
    <section
      style={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <h1 style={{ fontSize: "60px", color: "#ff2d95", textAlign: "center" }}>
        Festival DJ Experience
      </h1>
    </section>
  )
}
