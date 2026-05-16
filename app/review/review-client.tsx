"use client"

import { createClient } from "@/lib/supabase/browser"
import { Frown, Meh, Smile } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Card = {
  id: string
  question: string
  answer: string
}

type Rating = "hard" | "okay" | "easy"

export default function ReviewClient({
  cards,
  deckId,
}: {
  cards: Card[]
  deckId: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [completed, setCompleted] = useState(false)

  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentCard = cards[index]
  const isLastCard = index === cards.length - 1

  function getNextReviewDate(rating: Rating) {
  const date = new Date()

  if (rating === "hard") {
    date.setHours(date.getHours() + 12)
  }

  if (rating === "okay") {
    date.setDate(date.getDate() + 2)
  }

  if (rating === "easy") {
    date.setDate(date.getDate() + 5)
  }

  return date.toISOString()
}

  async function handleRating(rating: Rating) {
    if (!currentCard) return

    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    await supabase.from("reviews").insert({
      card_id: currentCard.id,
      user_id: user.id,
      rating,
    })

    await supabase
      .from("cards")
      .update({
        difficulty: rating,
        next_review_at: getNextReviewDate(rating),
      })
      .eq("id", currentCard.id)
      .eq("user_id", user.id)


    const today = new Date().toISOString().slice(0, 10)

const { data: profile } = await supabase
  .from("profiles")
  .select("streak_count, last_review_date")
  .eq("id", user.id)
  .single()

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const yesterdayString = yesterday.toISOString().slice(0, 10)

let nextStreak = 1

if (profile?.last_review_date === today) {
  nextStreak = profile.streak_count ?? 1
} else if (profile?.last_review_date === yesterdayString) {
  nextStreak = (profile.streak_count ?? 0) + 1
}

await supabase
  .from("profiles")
  .update({
    streak_count: nextStreak,
    last_review_date: today,
  })
  .eq("id", user.id)


    setSaving(false)

   if (isLastCard) {
  setCompleted(true)
  return
}

    setShowAnswer(false)
    setIndex((current) => current + 1)
  }

  if (completed) {
  return (
    <section className="space-y-6 text-center">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-6xl">🔥</p>
        <h1 className="mt-4 text-4xl font-black">Review complete</h1>
        <p className="mt-2 font-bold text-gray-500">
          You finished {cards.length} cards. Your memory just got stronger.
        </p>

        <button
          onClick={() => {
            router.push(`/decks/${deckId}`)
            router.refresh()
          }}
          className="mt-6 w-full rounded-2xl bg-violet-600 py-4 font-black text-white"
        >
          Back to deck
        </button>
      </div>
    </section>
  )
}

  if (cards.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
        <p className="text-5xl">🫠</p>
        <h1 className="mt-4 text-3xl font-black">No cards to review</h1>
        <p className="mt-2 font-bold text-gray-500">
          Add cards to this deck first.
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="font-bold text-violet-600">Review Mode</p>
        <h1 className="text-4xl font-black tracking-tight">
          Lock it into memory
        </h1>
      </div>

      <div className="rounded-[2rem] bg-white p-5 shadow-xl">
        <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
          Card {index + 1} / {cards.length}
        </span>

        <div className="mt-5 flex min-h-72 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-violet-600 to-cyan-400 p-6 text-center text-white">
          <h2 className="text-3xl font-black">
            {showAnswer ? currentCard.answer : currentCard.question}
          </h2>
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-5 w-full rounded-2xl bg-black py-4 font-black text-white"
          >
            Show Answer
          </button>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Hard", value: "hard", icon: Frown },
              { label: "Okay", value: "okay", icon: Meh },
              { label: "Easy", value: "easy", icon: Smile },
            ].map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.value}
                  disabled={saving}
                  onClick={() => handleRating(item.value as Rating)}
                  className="rounded-3xl bg-gray-50 p-5 font-black disabled:opacity-60"
                >
                  <Icon className="mx-auto mb-2 text-violet-600" />
                  {saving ? "Saving..." : item.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}