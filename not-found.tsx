import Link from "next/link"

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "1rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "5rem", fontWeight: 700, color: "#3b6e3a", margin: 0 }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1a1a1a", marginTop: "1rem" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#6b7280", marginTop: "0.5rem", maxWidth: "28rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "2rem",
          display: "inline-block",
          backgroundColor: "#3b6e3a",
          color: "#ffffff",
          padding: "0.625rem 1.5rem",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
      >
        Return to Home
      </Link>
    </div>
  )
}
