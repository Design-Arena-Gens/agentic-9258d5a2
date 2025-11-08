import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureBiography } from "@/lib/biography";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

function serializeBiography(biography: any) {
  return {
    ...biography,
    _id: biography._id ? biography._id.toString() : undefined,
    id: biography._id ? biography._id.toString() : biography.id,
    timeline: biography.timeline ?? [],
    personalInformation: biography.personalInformation ?? {
      name: "",
      dateOfBirth: "",
      birthplace: "",
      background: ""
    }
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const biography = await ensureBiography(session.user.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <DashboardShell initialBiography={serializeBiography(biography)} user={session.user} />
    </main>
  );
}
