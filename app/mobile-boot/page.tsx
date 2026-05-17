"use client"

import { createClient } from "@/lib/supabase/browser"
import { getNativeSession } from "@/lib/native-session"
import { useEffect } from "react"

export default function MobileBootPage() {
  const supabase = createClient()

  useEffect(() => {
    async function restoreSession() {
      const session = await getNativeSession()

      if (!session) {
        window.location.href = "/login"
        return
      }

      const { error } = await supabase.auth.setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      })

      if (error) {
        window.location.href = "/login"
        return
      }

      window.location.href = "/dashboard"
    }

    restoreSession()
  }, [supabase])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f0b18] text-white">
      <div className="text-center">
        <p className="text-5xl">🧠</p>
        <h1 className="mt-4 text-3xl font-black">Opening Stick...</h1>
      </div>
    </main>
  )
}