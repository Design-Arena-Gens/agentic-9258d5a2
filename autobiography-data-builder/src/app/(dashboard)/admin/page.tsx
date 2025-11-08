import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
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

  const records = users.map((user: any) => {
    const biography = biographyMap.get(user._id.toString());
    return {
      id: user._id.toString(),
      name: user.name ?? "Unknown",
      email: user.email,
      role: user.role ?? "user",
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : "—",
      updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—",
      autobiographyTitle: biography?.customization?.title ?? "—",
      public: biography?.isPublic ?? false,
      lastUpdated: biography?.updatedAt ? new Date(biography.updatedAt).toLocaleString() : "—"
    };
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
        <h1 className="font-display text-4xl text-white">Admin dashboard</h1>
        <p className="mt-2 text-sm text-white/70">
          Monitor user activity, publication status, and autobiography progress across the platform.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-white/60">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Autobiography</th>
                <th className="px-3 py-2">Last Update</th>
                <th className="px-3 py-2">Public</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {records.map((record) => (
                <tr key={record.id} className="text-white/80">
                  <td className="px-3 py-3">{record.name}</td>
                  <td className="px-3 py-3">{record.email}</td>
                  <td className="px-3 py-3 capitalize">{record.role}</td>
                  <td className="px-3 py-3">{record.autobiographyTitle}</td>
                  <td className="px-3 py-3 text-xs text-white/60">{record.lastUpdated}</td>
                  <td className="px-3 py-3">{record.public ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
