import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const PRO_PRICE_USD_CENTS = 499

export async function POST() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: PRO_PRICE_USD_CENTS,
      currency: "USD",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
      metadata: {
        user_id: user.id,
        plan: "pro",
      },
    }),
  })

  const data = await response.json()

  if (!response.ok || !data.status) {
    return NextResponse.json(
      { error: data.message || "Failed to initialize payment" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
  })
}