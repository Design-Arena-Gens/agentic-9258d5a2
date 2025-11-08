import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ensureBiography, toBiographyResponse, updateBiography } from "@/lib/biography";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const biography = await ensureBiography(session.user.id);
  return NextResponse.json(toBiographyResponse(biography));
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();

  const biography = await updateBiography(session.user.id, payload);
  return NextResponse.json(toBiographyResponse(biography));
}
