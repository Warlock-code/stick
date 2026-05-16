import { Brain, Sparkles, Flame, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="text-2xl font-black tracking-tight">Stick</div>

        <button className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white shadow-lg">
          Get Started
        </button>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 py-20 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            <Sparkles size={16} />
            AI flashcards that actually stick
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Study less.
            <br />
            Remember more.
          </h1>

          <p className="mt-5 max-w-md text-lg text-gray-600">
            Turn notes, PDFs, and topics into smart flashcards with AI. Review
            daily and let Stick train your memory.
          </p>

          <div className="mt-8 flex gap-3">
            <button className="flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 font-black text-white shadow-xl shadow-violet-300">
              Start learning <ArrowRight size={18} />
            </button>

            <button className="rounded-2xl bg-white px-6 py-4 font-black shadow-md">
              See demo
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-2xl">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-500 to-cyan-400 p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="font-black">Today’s Review</p>
              <Flame />
            </div>

            <h2 className="mt-8 text-5xl font-black">42</h2>
            <p className="font-bold opacity-90">cards due today</p>
          </div>

          <div className="mt-5 space-y-3">
            {["Biology", "Programming", "Forex Basics"].map((deck) => (
              <div
                key={deck}
                className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-3">
                    <Brain className="text-violet-600" size={20} />
                  </div>
                  <div>
                    <p className="font-black">{deck}</p>
                    <p className="text-sm text-gray-500">AI-powered deck</p>
                  </div>
                </div>

                <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                  Review
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}