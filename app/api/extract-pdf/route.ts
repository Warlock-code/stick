import { NextResponse } from "next/server"
import { PDFParse } from "pdf-parse"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()

    return NextResponse.json({
      text: result.text,
    })
  } catch (error) {
    console.error("PDF_EXTRACT_ERROR:", error)

    return NextResponse.json(
      { error: "Failed to extract PDF text" },
      { status: 500 }
    )
  }
}