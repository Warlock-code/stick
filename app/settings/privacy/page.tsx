import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { Lock, Shield, UserX } from "lucide-react"
import { redirect } from "next/navigation"

export default async function PrivacyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">Privacy</p>
          <h1 className="text-4xl font-black">Security settings</h1>
        </div>

        <div className="space-y-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <Lock className="text-violet-600" />
            <h2 className="mt-4 text-xl font-black">Your email</h2>
            <p className="mt-1 font-bold text-gray-500">{user.email}</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <Shield className="text-violet-600" />
            <h2 className="mt-4 text-xl font-black">Data protection</h2>
            <p className="mt-1 font-bold text-gray-500">
              Your decks, cards, and reviews are private to your account.
            </p>
          </div>

          <div className="rounded-3xl bg-red-50 p-5 shadow-sm">
            <UserX className="text-red-500" />
            <h2 className="mt-4 text-xl font-black text-red-500">
              Delete account
            </h2>
            <p className="mt-1 font-bold text-red-400">
              Coming later before launch.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}