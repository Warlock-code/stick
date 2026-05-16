import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { Bell, Moon, Shield, User } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, streak_count")
    .eq("id", user.id)
    .single()

  const name = profile?.full_name ?? user.email ?? "User"
  const initial = name.charAt(0).toUpperCase()

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">Profile</p>
          <h1 className="text-4xl font-black tracking-tight">
            Your Stick setup
          </h1>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-400 text-2xl font-black text-white">
              {initial}
            </div>

            <div>
              <h2 className="text-xl font-black">{name}</h2>
              <p className="font-bold text-gray-500">
                {profile?.plan ?? "free"} plan · {profile?.streak_count ?? 0} day streak
              </p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="mt-5 block w-full rounded-2xl bg-black py-4 text-center font-black text-white"
          >
            Upgrade to Pro
          </Link>
        </div>

        <div className="space-y-3">
          <Link
            href="/settings/edit"
            className="flex w-full items-center justify-between rounded-3xl bg-white p-5 font-black shadow-sm"
          >
            <span className="flex items-center gap-3">
              <User className="text-violet-600" />
              Account
            </span>
            <span className="text-gray-400">›</span>
          </Link>

          <Link
            href="/settings/notifications"
            className="flex w-full items-center justify-between rounded-3xl bg-white p-5 font-black shadow-sm"
          >
            <span className="flex items-center gap-3">
              <Bell className="text-violet-600" />
              Notifications
            </span>
            <span className="text-gray-400">›</span>
          </Link>

          <Link
            href="/settings/theme"
            className="flex w-full items-center justify-between rounded-3xl bg-white p-5 font-black shadow-sm"
          >
            <span className="flex items-center gap-3">
              <Moon className="text-violet-600" />
              Dark Mode
            </span>
            <span className="text-gray-400">›</span>
          </Link>

          <Link
  href="/settings/privacy"
  className="flex w-full items-center justify-between rounded-3xl bg-white p-5 font-black shadow-sm"
>
  <span className="flex items-center gap-3">
    <Shield className="text-violet-600" />
    Privacy & Security
  </span>
  <span className="text-gray-400">›</span>
</Link>
        </div>
      </section>
    </AppShell>
  )
}