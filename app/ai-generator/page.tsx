"use client"

import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/browser"
import { FileText, Sparkles, Upload, Wand2 } from "lucide-react"
import { useEffect, useState } from "react"

type Deck = {
  id: string
  name: string
}

type GeneratedCard = {
  question: string
  answer: string
}

export default function AiGeneratorPage() {
  const supabase = createClient()

  const [plan, setPlan] = useState("free")
  const [extractingPdf, setExtractingPdf] = useState(false)
  const [notes, setNotes] = useState("")
  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState("")
  const [cards, setCards] = useState<GeneratedCard[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single()

      setPlan(profile?.subscription_status ?? "free")

      const { data: deckData } = await supabase
        .from("decks")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setDecks(deckData || [])

      if (deckData?.length) {
        setSelectedDeck(deckData[0].id)
      }
    }

    loadData()
  }, [supabase])

  async function handlePdfUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("PDF must be smaller than 5MB")
      return
    }

    setExtractingPdf(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract PDF")
      }

      setNotes(data.text || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF extraction failed")
    } finally {
      setExtractingPdf(false)
    }
  }

  async function generateCards() {
    if (plan !== "pro") {
      setError("AI generation is a Pro feature.")
      return
    }

    if (!notes.trim()) {
      setError("Paste notes or upload a PDF first")
      return
    }

    setLoading(true)
    setError("")
    setCards([])

    try {
      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cards")
      }

      setCards(data.cards || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function saveCards() {
    if (!selectedDeck || cards.length === 0) return

    setSaving(true)
    setError("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } = await supabase
  .from("profiles")
  .select("subscription_status")
  .eq("id", user.id)
  .single()

const userPlan = profile?.subscription_status ?? "free"

if (userPlan !== "pro") {
  setError("Saving AI-generated cards is a Pro feature.")
  setSaving(false)
  return
}

    const payload = cards.map((card) => ({
      deck_id: selectedDeck,
      user_id: user.id,
      question: card.question,
      answer: card.answer,
    }))

    const { error } = await supabase.from("cards").insert(payload)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setCards([])
    setNotes("")
    setError("Cards saved successfully 🎉")
  }

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">AI Generator</p>
          <h1 className="text-4xl font-black tracking-tight">
            Turn anything into flashcards
          </h1>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-3">
              <FileText className="text-violet-600" />
            </div>

            <div>
              <h2 className="text-xl font-black">Paste your notes</h2>
              <p className="text-sm font-bold text-gray-500">
                Stick will pull out the testable points.
              </p>
            </div>
          </div>

          {plan !== "pro" && (
  <div className="mb-4 rounded-2xl bg-violet-50 p-4 font-bold text-violet-700">
    AI generation is locked on Free.
    <a href="/pricing" className="ml-1 underline">
      Upgrade to Pro.
    </a>
  </div>
)}

          {decks.length === 0 && (
            <div className="mb-4 rounded-2xl bg-yellow-50 p-4 font-bold text-yellow-700">
              Create a deck first before saving AI flashcards.
            </div>
          )}

          <select
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value)}
            className="mb-4 w-full rounded-2xl bg-gray-50 p-4 font-bold outline-none"
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>

          <label className="mb-4 flex cursor-pointer items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50 p-6 font-black text-violet-700">
            <Upload size={20} />
            {extractingPdf ? "Extracting PDF..." : "Upload PDF notes"}

            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={extractingPdf}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                handlePdfUpload(file)
              }}
            />
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste class notes, textbook text, forex rules, coding concepts..."
            className="min-h-56 w-full resize-none rounded-3xl bg-gray-50 p-4 font-medium outline-none placeholder:text-gray-400"
          />

          {error && (
            <p
              className={`mt-4 font-bold ${
                error.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {error}
            </p>
          )}

          <button
            onClick={generateCards}
            disabled={loading || extractingPdf || decks.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 font-black text-white shadow-lg shadow-violet-200 disabled:opacity-60"
          >
            <Wand2 size={18} />
            {loading ? "Generating..." : "Generate flashcards"}
          </button>
        </div>

        {cards.length > 0 && (
          <div className="rounded-[2rem] bg-black p-5 text-white shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-300" />
              <h2 className="text-xl font-black">AI Preview ({cards.length})</h2>
            </div>

            <div className="mt-5 space-y-3">
              {cards.map((card, index) => (
                <div key={index} className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm font-bold text-cyan-200">Q</p>
                  <p className="font-black">{card.question}</p>

                  <p className="mt-3 text-sm font-bold text-violet-200">A</p>
                  <p className="text-sm opacity-90">{card.answer}</p>
                </div>
              ))}
            </div>

            <button
              onClick={saveCards}
              disabled={saving || !selectedDeck}
              className="mt-5 w-full rounded-2xl bg-white py-4 font-black text-black disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save to deck"}
            </button>
          </div>
        )}
      </section>
    </AppShell>
  )
}