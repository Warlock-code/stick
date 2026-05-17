"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/browser"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("Password reset link sent. Check your email.")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
        <h1 className="text-4xl font-black">Reset password</h1>
        <p className="mt-2 font-bold text-gray-500">
          Enter your email to get a reset link.
        </p>

        <form onSubmit={sendReset} className="mt-6 space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-2xl bg-gray-50 px-4 py-4 font-bold outline-none"
          />

          {message && <p className="font-bold text-violet-600">{message}</p>}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 font-black text-white disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link href="/login" className="mt-5 block text-center font-bold text-violet-600">
          Back to login
        </Link>
      </div>
    </main>
  )
}