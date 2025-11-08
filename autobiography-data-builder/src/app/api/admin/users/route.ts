import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDatabase();
  const [users, biographies] = await Promise.all([
    db
      .collection("users")
      .find({})
      .toArray(),
    db
      .collection("biographies")
      .find({})
      .toArray()
  ]);

  const biographyMap = new Map<string, any>();
  biographies.forEach((bio: any) => {
    biographyMap.set(bio.userId, bio);
  });

  return NextResponse.json({
    users: users.map((user: any) => {
      const biography = biographyMap.get(user._id.toString());
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role ?? "user",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastActivity: biography?.updatedAt ?? null,
        autobiographyTitle: biography?.customization?.title ?? null,
        isPublic: biography?.isPublic ?? false
      };
    })
  });
}
