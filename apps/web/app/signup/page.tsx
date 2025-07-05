"use client";
import { useRouter } from "next/navigation";
// import Footer from 'components/layouts/Footer';
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Signup failed");
      } else {
        console.log(data);
        setSuccess("Signup successful! You can now log in.");
        setEmail("");
        setUsername("");
        setPassword("");
        router.push("/profile");
      }
    } catch (err: unknown) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "15vh",
        }}
      >
        <h1>Sign Up</h1>
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && (
            <div style={{ color: "red", textAlign: "center" }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "green", textAlign: "center" }}>{success}</div>
          )}
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
