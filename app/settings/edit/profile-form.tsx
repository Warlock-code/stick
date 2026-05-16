"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfileForm({
  initialName,
  email,
}: {
  initialName: string
  email: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null })
      .eq("id", user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/settings")
    router.refresh()
  }

  return (
    <form onSubmit={updateProfile} className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="font-bold text-violet-600">Account</p>
        <h1 className="text-4xl font-black">Edit profile</h1>
      </div>

      <input
        value={email}
        disabled
        className="w-full rounded-3xl bg-gray-100 p-5 font-bold text-gray-500 outline-none"
      />

      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full name"
        className="w-full rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
      />

      {error && <p className="font-bold text-red-500">{error}</p>}

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-violet-600 py-4 font-black text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  )
}