"use client"

import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/browser"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function NewCardPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const deckId = params.deckId as string

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function createCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required")
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
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if ((count ?? 0) >= 50) {
    setError("Free plan allows up to 50 cards. Upgrade to Pro for unlimited cards.")
    setLoading(false)
    return
  }
}

    const { error } = await supabase.from("cards").insert({
      deck_id: deckId,
      user_id: user.id,
      question: question.trim(),
      answer: answer.trim(),
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/decks/${deckId}`)
    router.refresh()
  }

  return (
    <AppShell>
      <form onSubmit={createCard} className="mx-auto max-w-xl space-y-5">
        <div>
          <p className="font-bold text-violet-600">New card</p>
          <h1 className="text-4xl font-black">Add flashcard</h1>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="min-h-32 w-full resize-none rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
        />

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
          className="min-h-40 w-full resize-none rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
        />

        {error && <p className="font-bold text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-violet-600 py-4 font-black text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save card"}
        </button>
      </form>
    </AppShell>
  )
}