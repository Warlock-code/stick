import { startProCheckout } from "@/app/actions/payment-actions"
import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"
import { Check, Sparkles } from "lucide-react"
import { redirect } from "next/navigation"

type PricingPageProps = {
  searchParams: Promise<{ checkout?: string }>
}

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Manual cards", "Basic review", "3 decks"],
  },
  {
    name: "Pro",
    price: "$4.99",
    features: [
      "AI cards",
      "Unlimited decks",
      "PDF to cards",
      "Weak topic tracking",
    ],
    popular: true,
  },
]

export default async function PricingPage({
  searchParams,
}: PricingPageProps) {
  const { checkout } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single()

  const currentPlan = profile?.subscription_status ?? "free"

  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <p className="font-bold text-violet-600">Pricing</p>
          <h1 className="text-4xl font-black tracking-tight">
            Pick your study power
          </h1>
        </div>

        {checkout === "coming-soon" && (
          <div className="rounded-2xl bg-yellow-50 p-4 font-bold text-yellow-700">
            Payments are not connected yet. Pro checkout will be added before
            launch.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrent =
              plan.name.toLowerCase() === currentPlan.toLowerCase()

            return (
              <div
                key={plan.name}
                className={`rounded-[2rem] p-5 shadow-sm ${
                  plan.popular ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500 px-3 py-1 text-sm font-black text-white">
                    <Sparkles size={14} />
                    Best value
                  </div>
                )}

                <h2 className="text-2xl font-black">{plan.name}</h2>
                <p className="mt-3 text-5xl font-black">{plan.price}</p>
                <p className="font-bold opacity-70">per month</p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 font-bold"
                    >
                      <Check size={18} />
                      {feature}
                    </div>
                  ))}
                </div>

                {plan.name === "Pro" ? (
                  <form action={startProCheckout}>
                    <button
                      disabled={isCurrent}
                      className="mt-6 w-full rounded-2xl bg-white py-4 font-black text-black disabled:opacity-60"
                    >
                      {isCurrent ? "Current plan" : "Upgrade to Pro"}
                    </button>
                  </form>
                ) : (
                  <button
                    disabled
                    className="mt-6 w-full rounded-2xl bg-black py-4 font-black text-white disabled:opacity-60"
                  >
                    Current plan
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}