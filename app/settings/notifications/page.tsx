import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NotificationsForm from "./notifications-form"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("review_reminders, reminder_time")
    .eq("id", user.id)
    .single()

  return (
    <AppShell>
      <NotificationsForm
        initialEnabled={profile?.review_reminders ?? true}
        initialTime={profile?.reminder_time ?? "18:00"}
      />
    </AppShell>
  )
}