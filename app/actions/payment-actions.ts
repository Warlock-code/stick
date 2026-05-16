"use server"

import { redirect } from "next/navigation"

export async function startProCheckout() {
  redirect("/pricing?checkout=coming-soon")
}