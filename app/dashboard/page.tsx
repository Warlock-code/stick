import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { Flame, Layers, Sparkles, Trophy } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const now = new Date().toISOString()

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_count")
    .eq("id", user.id)
    .single()

  const { count: deckCount } = await supabase
    .from("decks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: totalCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: dueCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review_at", now)

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">Welcome back 👋</p>
          <h1 className="text-4xl font-black tracking-tight">
            Ready to make it stick?
          </h1>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 to-cyan-400 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <p className="font-black">Today’s Reviews</p>
            <Flame />
          </div>

          <h2 className="mt-8 text-6xl font-black">{dueCards ?? 0}</h2>
          <p className="text-lg font-bold opacity-90">cards waiting for you</p>

          <Link
            href="/decks"
            className="mt-6 inline-block rounded-2xl bg-white px-6 py-4 font-black text-black"
          >
            Pick a deck
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Decks", value: deckCount ?? 0, icon: Layers },
            { label: "Cards", value: totalCards ?? 0, icon: Sparkles },
            {
              label: "Streak",
              value: `${profile?.streak_count ?? 0} days`,
              icon: Trophy,
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <Icon className="text-violet-600" />
                <p className="mt-4 text-3xl font-black">{item.value}</p>
                <p className="font-bold text-gray-500">{item.label}</p>
              </div>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}