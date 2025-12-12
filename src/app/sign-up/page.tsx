"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/app/actions/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else if (result?.message) {
      router.push("/login?message=" + encodeURIComponent(result.message));
    } else {
      router.push("/dashboard");
    }
  }

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
          <p className="text-sm text-white/60">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Details */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white/80">
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="ABC Construction Pty Ltd"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abn" className="text-white/80">
              ABN <span className="text-white/40">(optional)</span>
            </Label>
            <Input
              id="abn"
              name="abn"
              type="text"
              placeholder="12 345 678 901"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          <div className="my-6 border-t border-white/10" />

          {/* Account Details */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white/80">
              Your Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Smith"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

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
              autoComplete="new-password"
              minLength={6}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-white/80 hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
