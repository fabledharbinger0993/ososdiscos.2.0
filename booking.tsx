import Header from "../components/Header"
import BookingForm from "../components/BookingForm"

export default function BookingPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "60px 40px" }}>
        <BookingForm />
      </div>
    </div>
  )
}
