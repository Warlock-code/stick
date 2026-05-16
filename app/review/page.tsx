import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ReviewClient from "./review-client"

type ReviewPageProps = {
  searchParams: Promise<{ deckId?: string }>
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const { deckId } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  if (!deckId) redirect("/decks")

  const now = new Date().toISOString()

const { data: cards, error } = await supabase
  .from("cards")
  .select("id, question, answer")
  .eq("user_id", user.id)
  .eq("deck_id", deckId)
  .lte("next_review_at", now)
  .order("next_review_at", { ascending: true })

  if (error) throw new Error(error.message)

  return (
    <AppShell>
      <ReviewClient cards={cards ?? []} deckId={deckId} />
    </AppShell>
  )
}