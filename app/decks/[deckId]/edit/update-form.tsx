"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  deckId: string
  initialName: string
  initialEmoji: string
  initialDescription: string
}

export default function EditDeckForm({
  deckId,
  initialName,
  initialEmoji,
  initialDescription,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(initialName)
  const [emoji, setEmoji] = useState(initialEmoji)
  const [description, setDescription] = useState(initialDescription)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function updateDeck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!name.trim()) {
      setError("Deck name is required")
      return
    }

    setLoading(true)
    setError("")

    const { error } = await supabase
      .from("decks")
      .update({
        name: name.trim(),
        emoji: emoji.trim() || "🧠",
        description: description.trim() || null,
      })
      .eq("id", deckId)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/decks/${deckId}`)
    router.refresh()
  }

  return (
    <form onSubmit={updateDeck} className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="font-bold text-violet-600">Edit deck</p>
        <h1 className="text-4xl font-black">Update deck</h1>
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
        className="w-full rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-32 w-full resize-none rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
      />

      {error && <p className="font-bold text-red-500">{error}</p>}

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-violet-600 py-4 font-black text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  )
}