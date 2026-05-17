"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
      })
    }

    router.push("/check-email")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
        <h1 className="text-4xl font-black">Join Stick</h1>
        <p className="mt-2 font-bold text-gray-500">
          Build a memory system that sticks.
        </p>

        <form onSubmit={handleSignUp} className="mt-6 space-y-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Full name"
            required
            className="w-full rounded-2xl bg-gray-50 px-4 py-4 font-bold outline-none"
          />

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
            minLength={6}
            className="w-full rounded-2xl bg-gray-50 px-4 py-4 font-bold outline-none"
          />

          {error && <p className="font-bold text-red-500">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-violet-600 py-4 font-black text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center font-bold text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}