import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "@/components/forms/register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <h1 className="font-display text-4xl text-white lg:text-5xl">
            Guided storytelling for every chapter of your life.
          </h1>
          <p className="max-w-lg text-white/70">
            Answer thoughtful prompts, attach memories, and collaborate with AI to shape a polished
            autobiography you can be proud to share.
          </p>
          <p className="text-sm text-white/60">
            Already have an account?{" "}
            <Link className="font-semibold text-primary-300 hover:text-primary-200" href="/login">
              Sign in
            </Link>{" "}
            instead.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
