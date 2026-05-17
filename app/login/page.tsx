"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    window.location.href = "/dashboard"
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
        <h1 className="text-4xl font-black">Welcome back</h1>
        <p className="mt-2 font-bold text-gray-500">Log in to keep learning.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-2xl bg-gray-50 px-4 py-4 font-bold outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-2xl bg-gray-50 px-4 py-4 font-bold outline-none"
          />

          {error && <p className="font-bold text-red-500">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 font-black text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center font-bold text-gray-500">
          No account?{" "}
          <Link href="/sign-up" className="text-violet-600">
            Sign up
          </Link>
          <Link href="/forgot-password" className="block text-right text-sm font-bold text-violet-600">
  Forgot password?
</Link>
        </p>
      </div>
    </main>
  )
}