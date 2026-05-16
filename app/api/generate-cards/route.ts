import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { notes } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      )
    }

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      )
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Create 5 to 12 flashcards from these notes.

Return ONLY valid JSON.
No markdown.
No explanation.

JSON format:
{
  "cards": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}

Notes:
${notes}
      `,
    })

    const text = response.output_text.trim()
    const parsed = JSON.parse(text)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("AI_GENERATE_ERROR:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate cards",
      },
      { status: 500 }
    )
  }
}