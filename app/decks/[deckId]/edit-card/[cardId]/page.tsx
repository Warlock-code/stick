import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import EditCardForm from "./update-form"

type Props = {
  params: Promise<{
    deckId: string
    cardId: string
  }>
}

export default async function EditCardPage({ params }: Props) {
  const { deckId, cardId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: card } = await supabase
    .from("cards")
    .select("id, question, answer")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .single()

  if (!card) redirect(`/decks/${deckId}`)

  return (
    <AppShell>
      <EditCardForm
        deckId={deckId}
        cardId={card.id}
        initialQuestion={card.question}
        initialAnswer={card.answer}
      />
    </AppShell>
  )
}