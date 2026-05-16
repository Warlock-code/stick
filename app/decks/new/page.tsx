"use client"

import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewDeckPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("🧠")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function createDeck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!name.trim()) {
      setError("Deck name is required")
      return
    }

    setLoading(true)
    setError("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase
  .from("profiles")
  .select("subscription_status")
  .eq("id", user.id)
  .single()

const plan = profile?.subscription_status ?? "free"

if (plan === "free") {
  const { count } = await supabase
    .from("decks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if ((count ?? 0) >= 3) {
    setError("Free plan allows up to 3 decks. Upgrade to Pro for unlimited decks.")
    setLoading(false)
    return
  }
}

    const { error } = await supabase.from("decks").insert({
      user_id: user.id,
      name: name.trim(),
      emoji: emoji.trim() || "🧠",
      description: description.trim() || null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/decks")
    router.refresh()
  }

  return (
    <AppShell>
      <form onSubmit={createDeck} className="mx-auto max-w-xl space-y-5">
        <div>
          <p className="font-bold text-violet-600">New deck</p>
          <h1 className="text-4xl font-black">Create a deck</h1>
        </div>

        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={4}
          className="w-full rounded-3xl bg-white p-5 text-4xl shadow-sm outline-none"
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deck name"
          className="w-full rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          className="min-h-32 w-full resize-none rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
        />

        {error && <p className="font-bold text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-violet-600 py-4 font-black text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create deck"}
        </button>
      </form>
    </AppShell>
  )
}