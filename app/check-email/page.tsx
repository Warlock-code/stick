import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-xl">
        <p className="text-6xl">📩</p>

        <h1 className="mt-4 text-4xl font-black">Check your email</h1>

        <p className="mt-2 font-bold text-gray-500">
          We sent you a confirmation link. Open it to activate your Stick account.
        </p>

        <Link
          href="/login"
          className="mt-6 block rounded-2xl bg-violet-600 py-4 font-black text-white"
        >
          Go to login
        </Link>
      </div>
    </main>
  )
}