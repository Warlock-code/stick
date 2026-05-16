"use client"

import { deleteCard } from "@/app/actions/deck-actions"
import { Edit, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

type Card = {
  id: string
  question: string
  answer: string
}

type Props = {
  deckId: string
  cards: Card[]
}

export default function CardList({ deckId, cards }: Props) {
  const [query, setQuery] = useState("")

  const filteredCards = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return cards

    return cards.filter((card) => {
      return (
        card.question.toLowerCase().includes(search) ||
        card.answer.toLowerCase().includes(search)
      )
    })
  }, [cards, query])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
        <Search className="text-gray-400" size={20} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards..."
          className="w-full bg-transparent font-bold outline-none placeholder:text-gray-400"
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">🔍</p>
          <h2 className="mt-3 text-2xl font-black">No cards found</h2>
          <p className="mt-2 font-bold text-gray-500">
            Try searching another word.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <div key={card.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-violet-600">
                    QUESTION
                  </p>
                  <h2 className="mt-1 font-black">{card.question}</h2>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/decks/${deckId}/edit-card/${card.id}`}
                    className="rounded-2xl bg-violet-50 p-3 text-violet-600"
                  >
                    <Edit size={18} />
                  </Link>

                  <form action={deleteCard.bind(null, card.id, deckId)}>
                    <button className="rounded-2xl bg-red-50 p-3 text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>

              <p className="mt-4 text-sm font-black text-gray-400">ANSWER</p>
              <p className="mt-1 font-bold text-gray-600">{card.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}