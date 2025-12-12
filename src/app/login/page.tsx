"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const redirect = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      router.push(redirect);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
          autoComplete="email"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-white text-black hover:bg-white/90"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              SiteProof
            </span>
          </Link>
          <p className="text-sm text-white/60">Sign in to your account</p>
        </div>

        <Suspense fallback={<div className="h-[200px]" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-white/80 hover:text-white">
            Get started
          </Link>
        </p>
      </div>
    </main>
  );
}
