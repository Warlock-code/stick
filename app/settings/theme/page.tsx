import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ThemeForm from "./theme-form"

export default async function ThemePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("theme")
    .eq("id", user.id)
    .single()

  return (
    <AppShell>
      <ThemeForm initialTheme={profile?.theme ?? "light"} />
    </AppShell>
  )
}