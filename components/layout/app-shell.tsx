"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser"
import { Brain, Clock, Home, Layers, LogOut, Sparkles, User } from "lucide-react"
import { useEffect, useState } from "react"

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Decks", href: "/decks", icon: Layers },
  { label: "AI", href: "/ai-generator", icon: Sparkles },
  { label: "History", href: "/history", icon: Clock },
  { label: "Profile", href: "/settings", icon: User },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    async function loadTheme() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("theme")
        .eq("id", user.id)
        .single()

      const userTheme = data?.theme ?? "light"

      setTheme(userTheme)
      document.documentElement.classList.toggle("dark", userTheme === "dark")
    }

    loadTheme()
  }, [supabase, pathname])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <main
      className={`min-h-screen pb-24 transition ${
        theme === "dark" ? "bg-[#0f0b18] text-white" : "bg-[#f8f7ff] text-black"
      }`}
    >
      <header
        className={`sticky top-0 z-50 border-b px-5 py-4 backdrop-blur-xl ${
          theme === "dark"
            ? "border-white/10 bg-[#171322]/80"
            : "border-black/5 bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-2xl bg-black p-2 text-white">
              <Brain size={20} />
            </div>
            <span className="text-xl font-black">Stick</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white"
            >
              Upgrade
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-full bg-white p-2 text-black shadow-sm"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6">{children}</section>

      <nav className="fixed bottom-4 left-1/2 z-50 flex w-[92%] max-w-md -translate-x-1/2 justify-between rounded-full bg-black px-5 py-3 text-white shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 text-xs font-bold opacity-80"
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </main>
  )
}