"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  deckId: string
  cardId: string
  initialQuestion: string
  initialAnswer: string
}

export default function EditCardForm({
  deckId,
  cardId,
  initialQuestion,
  initialAnswer,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [question, setQuestion] = useState(initialQuestion)
  const [answer, setAnswer] = useState(initialAnswer)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function updateCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase
      .from("cards")
      .update({
        question: question.trim(),
        answer: answer.trim(),
      })
      .eq("id", cardId)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/decks/${deckId}`)
    router.refresh()
  }

  return (
    <form onSubmit={updateCard} className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="font-bold text-violet-600">Edit card</p>
        <h1 className="text-4xl font-black">Update flashcard</h1>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="min-h-32 w-full resize-none rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
      />

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="min-h-40 w-full resize-none rounded-3xl bg-white p-5 font-bold shadow-sm outline-none"
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