import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import DeckList from "./deck-list"

type Deck = {
  id: string
  name: string
  emoji: string | null
  description: string | null
  created_at: string
  cards: { id: string; next_review_at: string }[]
}

export default async function DecksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const now = new Date().toISOString()

  const { data: decks, error } = await supabase
    .from("decks")
    .select(`
      id,
      name,
      emoji,
      description,
      created_at,
      cards (
        id,
        next_review_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-violet-600">Your decks</p>
            <h1 className="text-4xl font-black tracking-tight">
              Pick your brain fuel
            </h1>
          </div>

          <Link
            href="/decks/new"
            className="rounded-2xl bg-black p-4 text-white shadow-lg"
          >
            <Plus />
          </Link>
        </div>

        {!decks || decks.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <p className="text-5xl">🧠</p>
            <h2 className="mt-4 text-2xl font-black">No decks yet</h2>
            <p className="mt-2 font-bold text-gray-500">
              Create your first deck and start making things stick.
            </p>

            <Link
              href="/decks/new"
              className="mt-5 inline-flex rounded-2xl bg-violet-600 px-6 py-4 font-black text-white"
            >
              Create deck
            </Link>
          </div>
        ) : (
          <DeckList decks={decks as Deck[]} now={now} />
        )}
      </section>
    </AppShell>
  )
}