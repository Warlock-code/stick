import { deleteDeck } from "@/app/actions/deck-actions"
import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { BookOpen, Edit, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import CardList from "./card-list"

type PageProps = {
  params: Promise<{ deckId: string }>
}

export default async function DeckDetailPage({ params }: PageProps) {
  const { deckId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: deck } = await supabase
    .from("decks")
    .select("id, name, emoji, description")
    .eq("id", deckId)
    .eq("user_id", user.id)
    .single()

  if (!deck) redirect("/decks")

  const now = new Date().toISOString()

  const { data: cards } = await supabase
    .from("cards")
    .select("id, question, answer, next_review_at, created_at")
    .eq("deck_id", deckId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalCards = cards?.length ?? 0
  const dueCards =
    cards?.filter((card) => card.next_review_at <= now).length ?? 0

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-5xl">{deck.emoji ?? "🧠"}</p>
            <h1 className="mt-3 text-4xl font-black">{deck.name}</h1>

            {deck.description && (
              <p className="mt-2 font-bold text-gray-500">
                {deck.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/decks/${deck.id}/new-card`}
              className="rounded-2xl bg-black p-4 text-white shadow-lg"
            >
              <Plus />
            </Link>

            <Link
              href={`/decks/${deck.id}/edit`}
              className="rounded-2xl bg-violet-100 p-4 text-violet-600 shadow-lg"
            >
              <Edit />
            </Link>

            <form action={deleteDeck.bind(null, deck.id)}>
              <button className="rounded-2xl bg-red-500 p-4 text-white shadow-lg">
                <Trash2 />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black">{totalCards}</p>
            <p className="font-bold text-gray-500">Total cards</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black">{dueCards}</p>
            <p className="font-bold text-gray-500">Due now</p>
          </div>
        </div>

        <Link
          href={`/review?deckId=${deck.id}`}
          className={`block rounded-2xl py-4 text-center font-black text-white ${
            dueCards === 0 ? "bg-gray-400" : "bg-violet-600"
          }`}
        >
          {dueCards === 0 ? "No reviews due" : `Start Review · ${dueCards} due`}
        </Link>

        {!cards || cards.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <BookOpen className="mx-auto text-violet-600" size={36} />
            <h2 className="mt-4 text-2xl font-black">No cards yet</h2>
            <p className="mt-2 font-bold text-gray-500">
              Add your first flashcard to this deck.
            </p>
          </div>
        ) : (
          <CardList deckId={deck.id} cards={cards} />
        )}
      </section>
    </AppShell>
  )
}