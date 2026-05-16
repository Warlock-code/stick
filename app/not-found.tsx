import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7ff] px-5">
      <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <p className="text-6xl">🫠</p>

        <h1 className="mt-4 text-3xl font-black">
          Page not found
        </h1>

        <p className="mt-2 font-bold text-gray-500">
          This page does not exist.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 block w-full rounded-2xl bg-violet-600 py-4 font-black text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}