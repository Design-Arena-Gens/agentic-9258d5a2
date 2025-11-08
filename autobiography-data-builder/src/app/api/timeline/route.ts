import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ensureBiography, toBiographyResponse, updateTimeline } from "@/lib/biography";
import type { BiographyDocument } from "@/types/biography";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const timeline = payload?.timeline as BiographyDocument["timeline"];
  if (!Array.isArray(timeline)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const biography = await updateTimeline(session.user.id, timeline);
  return NextResponse.json(toBiographyResponse(biography));
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const biography = await ensureBiography(session.user.id);
  return NextResponse.json(biography.timeline);
}
