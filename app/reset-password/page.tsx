"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    router.push("/login")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
        <h1 className="text-4xl font-black">New password</h1>

        <p className="mt-2 font-bold text-gray-500">
          Enter a new password for your Stick account.
        </p>

        <form onSubmit={updatePassword} className="mt-6 space-y-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={6}
            required
            placeholder="New password"
            className="w-full rounded-2xl bg-gray-50 px-4 py-4 font-bold outline-none"
          />

          {message && <p className="font-bold text-red-500">{message}</p>}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-violet-600 py-4 font-black text-white disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  )
}