import { AppShell } from "@/components/layout/app-shell"

export default function PrivacyPage() {
  return (
    <AppShell>
      <section className="prose max-w-none space-y-6">
        <div>
          <p className="font-bold text-violet-600">
            Legal
          </p>

          <h1 className="text-4xl font-black">
            Privacy Policy
          </h1>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm space-y-5">
          <p>
            Stick collects basic account information such as your email,
            flashcards, decks, and study activity to provide the learning
            experience.
          </p>

          <p>
            Your data is securely stored using Supabase infrastructure.
          </p>

          <p>
            Payments are securely processed through Paystack. Stick does not
            store your card details.
          </p>

          <p>
            AI-generated flashcards may be processed using third-party AI
            services.
          </p>

          <p>
            We do not sell your personal information.
          </p>

          <p>
            By using Stick, you agree to this Privacy Policy.
          </p>
        </div>
      </section>
    </AppShell>
  )
}