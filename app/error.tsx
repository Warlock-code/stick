"use client"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7ff] px-5">
      <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <p className="text-6xl">😵‍💫</p>

        <h1 className="mt-4 text-3xl font-black">
          Something broke
        </h1>

        <p className="mt-2 font-bold text-gray-500">
          Try again. If it keeps happening, check the terminal error.
        </p>

        <button
          onClick={reset}
          className="mt-6 w-full rounded-2xl bg-violet-600 py-4 font-black text-white"
        >
          Try again
        </button>
      </div>
    </main>
  )
}