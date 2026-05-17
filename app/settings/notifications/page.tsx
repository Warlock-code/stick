"use client"

import { AppShell } from "@/components/layout/app-shell"
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/lib/notifications"
import { useState } from "react"

export default function NotificationsPage() {
  const [message, setMessage] = useState("")

  async function enableNotifications() {
    try {
      await requestNotificationPermission()
      await scheduleDailyReminder()

      setMessage("Daily reminders enabled.")
    } catch {
      setMessage("Failed to enable notifications.")
    }
  }

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">
            Notifications
          </p>

          <h1 className="text-4xl font-black">
            Stay consistent
          </h1>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">
            Daily review reminders
          </h2>

          <p className="mt-2 font-bold text-gray-500">
            Get reminded to review your flashcards daily.
          </p>

          <button
            onClick={enableNotifications}
            className="mt-5 w-full rounded-2xl bg-violet-600 py-4 font-black text-white"
          >
            Enable reminders
          </button>

          {message && (
            <p className="mt-4 font-bold text-violet-600">
              {message}
            </p>
          )}
        </div>
      </section>
    </AppShell>
  )
}