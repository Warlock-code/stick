import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { Clock, Star } from "lucide-react"
import { redirect } from "next/navigation"

type ReviewHistoryItem = {
  id: string
  rating: string
  reviewed_at: string
  cards: {
    question: string
    answer: string
    decks: {
      name: string
      emoji: string | null
    } | null
  } | null
}

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      reviewed_at,
      cards (
        question,
        answer,
        decks (
          name,
          emoji
        )
      )
    `)
    .eq("user_id", user.id)
    .order("reviewed_at", { ascending: false })
    .limit(50)

  if (error) throw new Error(error.message)

  const reviews = (data ?? []) as unknown as ReviewHistoryItem[]

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">History</p>
          <h1 className="text-4xl font-black tracking-tight">
            Your recent reviews
          </h1>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-sm">
            <Clock className="mx-auto text-violet-600" size={36} />
            <h2 className="mt-4 text-2xl font-black">No reviews yet</h2>
            <p className="mt-2 font-bold text-gray-500">
              Review some cards and they’ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black">
                      {review.cards?.decks?.emoji ?? "🧠"}{" "}
                      {review.cards?.decks?.name ?? "Deck"}
                    </p>

                    <p className="mt-1 font-bold text-gray-500">
                      {review.cards?.question ?? "Deleted card"}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm font-black text-violet-700">
                    <Star size={14} />
                    {review.rating}
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold text-gray-400">
                  {new Date(review.reviewed_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}