import { AppShell } from "@/components/layout/app-shell"

export default function TermsPage() {
  return (
    <AppShell>
      <section className="prose max-w-none space-y-6">
        <div>
          <p className="font-bold text-violet-600">
            Legal
          </p>

          <h1 className="text-4xl font-black">
            Terms of Service
          </h1>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm space-y-5">
          <p>
            Stick is provided as a study and learning platform.
          </p>

          <p>
            Users are responsible for the content they create and upload.
          </p>

          <p>
            Abuse, hacking attempts, or misuse of the platform may result in
            account suspension.
          </p>

          <p>
            Premium subscriptions are billed through Paystack.
          </p>

          <p>
            Stick may update features, pricing, or services at any time.
          </p>

          <p>
            By using Stick, you agree to these Terms of Service.
          </p>
        </div>
      </section>
    </AppShell>
  )
}