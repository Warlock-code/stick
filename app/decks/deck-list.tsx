"use client"

import { BookOpen, Brain, Search } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

type Deck = {
  id: string
  name: string
  emoji: string | null
  description: string | null
  cards: { id: string; next_review_at: string }[]
}

type Props = {
  decks: Deck[]
  now: string
}

export default function DeckList({ decks, now }: Props) {
  const [query, setQuery] = useState("")

  const filteredDecks = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return decks

    return decks.filter((deck) => {
      return (
        deck.name.toLowerCase().includes(search) ||
        deck.description?.toLowerCase().includes(search)
      )
    })
  }, [decks, query])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
        <Search className="text-gray-400" size={20} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decks..."
          className="w-full bg-transparent font-bold outline-none placeholder:text-gray-400"
        />
      </div>

      {filteredDecks.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">🔍</p>
          <h2 className="mt-3 text-2xl font-black">No decks found</h2>
          <p className="mt-2 font-bold text-gray-500">
            Try another search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDecks.map((deck) => {
            const totalCards = deck.cards?.length ?? 0
            const dueCards =
              deck.cards?.filter((card) => card.next_review_at <= now)
                .length ?? 0

            return (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="block rounded-[2rem] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{deck.emoji ?? "🧠"}</div>

                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-black text-violet-700">
                    {dueCards} due
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-black">{deck.name}</h2>

                {deck.description && (
                  <p className="mt-2 font-bold text-gray-500">
                    {deck.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                    <BookOpen size={16} />
                    {totalCards} cards
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-black text-white">
                    <Brain size={16} />
                    Open
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}