"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NotificationsForm({
  initialEnabled,
  initialTime,
}: {
  initialEnabled: boolean
  initialTime: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [enabled, setEnabled] = useState(initialEnabled)
  const [time, setTime] = useState(initialTime)
  const [saving, setSaving] = useState(false)

  async function saveSettings() {
    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return router.push("/login")

    await supabase
      .from("profiles")
      .update({
        review_reminders: enabled,
        reminder_time: time,
      })
      .eq("id", user.id)

    router.push("/settings")
    router.refresh()
  }

  return (
    <section className="mx-auto max-w-xl space-y-5">
      <div>
        <p className="font-bold text-violet-600">Notifications</p>
        <h1 className="text-4xl font-black">Review reminders</h1>
      </div>

      <button
        onClick={() => setEnabled((current) => !current)}
        className={`w-full rounded-3xl p-5 text-left font-black shadow-sm ${
          enabled ? "bg-violet-600 text-white" : "bg-white text-black"
        }`}
      >
        {enabled ? "Reminders On" : "Reminders Off"}
      </button>

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full rounded-3xl bg-white p-5 font-black shadow-sm outline-none"
      />

      <button
        onClick={saveSettings}
        disabled={saving}
        className="w-full rounded-2xl bg-black py-4 font-black text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </section>
  )
}