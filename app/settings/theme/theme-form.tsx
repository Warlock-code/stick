"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ThemeForm({ initialTheme }: { initialTheme: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [theme, setTheme] = useState(initialTheme)
  const [saving, setSaving] = useState(false)

  async function updateTheme(value: string) {
    setSaving(true)
    setTheme(value)
    document.documentElement.classList.toggle("dark", value === "dark")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({ theme: value })
      .eq("id", user.id)

    if (error) {
      setSaving(false)
      return
    }

    localStorage.setItem("stick-theme", value)

    router.refresh()
    setSaving(false)
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="font-bold text-violet-600">Theme</p>
        <h1 className="text-4xl font-black">Choose appearance</h1>
      </div>

      {["light", "dark"].map((option) => (
        <button
          key={option}
          disabled={saving}
          onClick={() => updateTheme(option)}
          className={`w-full rounded-3xl p-5 text-left font-black shadow-sm disabled:opacity-60 ${
            theme === option
              ? "bg-violet-600 text-white"
              : "bg-white text-black"
          }`}
        >
          {option === "light" ? "Light Mode" : "Dark Mode"}
        </button>
      ))}
    </section>
  )
}