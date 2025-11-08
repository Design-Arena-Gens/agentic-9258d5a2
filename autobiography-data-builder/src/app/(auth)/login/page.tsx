import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <h1 className="font-display text-4xl text-white lg:text-5xl">
            Your memories, organized and ready to become a book.
          </h1>
          <p className="max-w-lg text-white/70">
            Log in to continue capturing your stories, mapping your timeline, and generating
            beautifully written chapters with the help of AI.
          </p>
          <p className="text-sm text-white/60">
            New here?{" "}
            <Link className="font-semibold text-primary-300 hover:text-primary-200" href="/register">
              Create an account
            </Link>{" "}
            to begin.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
