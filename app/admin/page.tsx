"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tilaak-admin-token");
    if (token === "tilaak-admin-authenticated") {
      router.push("/admin/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("tilaak-admin-token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F8F8" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "#C09A52" }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8F8F8" }}>
      <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", padding: "48px 40px", width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div className="text-center mb-10">
          <span
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 200,
              fontSize: "24px",
              letterSpacing: "0.35em",
              color: "#111111",
            }}
          >
            TILAAK
          </span>
          <p
            className="mt-1"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#C09A52",
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#888888",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "#888888" }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full outline-none transition-colors"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "14px",
                  color: "#111111",
                  border: "1px solid #E5E5E5",
                  padding: "14px 16px 14px 44px",
                  borderRadius: 0,
                  backgroundColor: "#FFFFFF",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#111111")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
                autoFocus
              />
            </div>
          </div>

          {error && (
            <p
              className="text-center px-4 py-3"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                fontSize: "13px",
                color: "#CC0000",
                backgroundColor: "#FFF0F0",
                border: "1px solid #FFCCCC",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              backgroundColor: "#111111",
              color: "#FFFFFF",
              padding: "14px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
