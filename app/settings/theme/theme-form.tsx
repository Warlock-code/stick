"use client"

import { createClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ThemeForm({ initialTheme }: { initialTheme: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [theme, setTheme] = useState(initialTheme)

  async function updateTheme(value: string) {
    setTheme(value)
    document.documentElement.classList.toggle("dark", value === "dark")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return router.push("/login")

    await supabase.from("profiles").update({ theme: value }).eq("id", user.id)

    document.documentElement.classList.toggle("dark", value === "dark")
router.refresh()
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
          onClick={() => updateTheme(option)}
          className={`w-full rounded-3xl p-5 text-left font-black shadow-sm ${
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