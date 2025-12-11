"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 20]);

  return (
    <motion.header
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-colors"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">SiteProof</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm text-white/60 transition-colors hover:text-white sm:block"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full bg-white px-5 text-black hover:bg-white/90"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
