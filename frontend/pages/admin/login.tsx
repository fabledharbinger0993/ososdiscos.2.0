import { useState, FormEvent } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "#1a1a1a",
  border: "1px solid #2e2e2e",
  borderRadius: "18px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const,
  marginBottom: "16px",
}

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password })
      localStorage.setItem("token", res.data.token)
      window.location.href = "/admin"
    } catch {
      setError("Invalid username or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "360px",
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "18px",
          padding: "40px",
        }}
      >
        <h2 style={{ color: "#ff2d95", fontSize: "22px", marginBottom: "8px" }}>Admin</h2>
        <p style={{ color: "#555", fontSize: "13px", marginBottom: "32px" }}>
          Sign in to manage your site.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p style={{ color: "#ff2d95", fontSize: "13px", marginBottom: "16px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#333" : "#ff2d95",
              color: "#fff",
              border: "none",
              borderRadius: "18px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
