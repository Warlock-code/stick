import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import EditDeckForm from "./update-form"

type Props = {
  params: Promise<{ deckId: string }>
}

export default async function EditDeckPage({ params }: Props) {
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

  return (
    <AppShell>
      <EditDeckForm
        deckId={deck.id}
        initialName={deck.name}
        initialEmoji={deck.emoji ?? "🧠"}
        initialDescription={deck.description ?? ""}
      />
    </AppShell>
  )
}