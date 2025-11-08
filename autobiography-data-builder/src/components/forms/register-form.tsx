"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Registration failed");
      }

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <Card className="mx-auto w-full max-w-md border-white/10 bg-white/10 p-8 backdrop-blur">
      <div className="space-y-2 text-center">
        <h2 className="font-display text-3xl text-white">Create your account</h2>
        <p className="text-sm text-white/60">
          Start saving memories and crafting your autobiography journey.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Full name</label>
          <Input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Jane Storyteller"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <Button type="button" variant="secondary" className="w-full" onClick={handleGoogle}>
          Continue with Google
        </Button>
      </div>
    </Card>
  );
}
