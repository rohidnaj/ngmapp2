import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
  return NextResponse.json({ fileId: params.fileId, status: "available" })
}
