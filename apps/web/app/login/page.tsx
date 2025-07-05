"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials");
      } else {
        setError("");
        console.log(data);

        router.push("/profile");
        // This will trigger a server re-render of the layout and Navbar
        router.refresh();
      }
    } catch (err: unknown) {
      console.log(err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div id="login-page">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "15vh",
        }}
      >
        <h1>Login</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            minWidth: 320,
            maxWidth: 400,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            background: "#fff",
            padding: 32,
            borderRadius: 8,
            boxShadow: "0 2px 16px #0001",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 4,
              background: "#222",
              color: "#fff",
              border: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div style={{ color: "red", textAlign: "center" }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
