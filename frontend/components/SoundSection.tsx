export default function SoundSection() {
  return (
    <section id="soundcloud" style={{ padding: "60px 40px", background: "#0a0a0a", color: "#fff" }}>
      <h2 style={{ fontSize: "36px", color: "#ff2d95", marginBottom: "24px" }}>Live Music</h2>

      <div
        style={{
          border: "1px solid #1e1e1e",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <iframe
          width="100%"
          height="300"
          style={{ display: "block", border: "none" }}
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/3207"
        />
      </div>
    </section>
  )
}
