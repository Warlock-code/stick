"use client"

import { useState } from "react"

export default function CheckoutButton({
  disabled,
}: {
  disabled: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function startCheckout() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed")
      }

      window.location.href = data.authorizationUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={startCheckout}
        disabled={disabled || loading}
        className="mt-6 w-full rounded-2xl bg-white py-4 font-black text-black disabled:opacity-60"
      >
        {disabled ? "Current plan" : loading ? "Opening checkout..." : "Upgrade to Pro"}
      </button>

      {error && <p className="mt-3 font-bold text-red-500">{error}</p>}
    </div>
  )
}