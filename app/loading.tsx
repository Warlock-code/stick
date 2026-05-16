export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7ff] px-5">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <h1 className="mt-5 text-2xl font-black">Loading Stick...</h1>
      </div>
    </main>
  )
}