import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{ reference?: string }>
}

export default async function PaymentCallbackPage({ searchParams }: Props) {
  const { reference } = await searchParams

  if (!reference) {
    redirect("/pricing?checkout=failed")
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  )

  const data = await response.json()

  if (!response.ok || !data.status || data.data.status !== "success") {
    redirect("/pricing?checkout=failed")
  }

  const userId = data.data.metadata?.user_id

  if (!userId) {
    redirect("/pricing?checkout=failed")
  }

  const supabase = await createClient()

  await supabase
    .from("profiles")
    .update({
      subscription_status: "pro",
      subscription_provider: "paystack",
      subscription_customer_id: data.data.customer?.customer_code ?? null,
      plan: "pro",
    })
    .eq("id", userId)

  redirect("/pricing?checkout=success")
}