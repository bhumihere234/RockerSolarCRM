// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Signup failed");

      // Save token for authenticated API calls
      localStorage.setItem("token", payload.token);

      // (Optional) store user details
      if (payload.user) {
        localStorage.setItem("userName", payload.user.name ?? "");
        localStorage.setItem("userEmail", payload.user.email ?? "");
        localStorage.setItem("userDesignation", payload.user.designation ?? "Salesperson");
      }

      // Role/designation-based redirect
      const role = (payload.user?.role || payload.user?.designation || "").toLowerCase();
      if (role.includes("manager")) {
        router.push("/dashboard/manager");
      } else if (role.includes("general")) {
        router.push("/dashboard/general");
      } else {
        // 🔹 Default: main dashboard (not salesperson)
        router.push("/dashboard");
      }
  } catch (err) {
  alert(typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-md shadow p-6 space-y-4"
      >
        <h1 className="text-lg font-semibold text-gray-900">Sign Up</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded text-white py-2 text-sm font-medium disabled:opacity-60"
          style={{ backgroundColor: "#F16336" }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
