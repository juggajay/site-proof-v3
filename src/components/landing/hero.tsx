"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown, Play } from "lucide-react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-black">
      {/* Background video/image placeholder - cinematic */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80')`,
          }}
        />
      </motion.div>

      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03]" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6"
      >
        <div className="max-w-5xl text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 font-mono-data text-sm uppercase tracking-[0.3em] text-white/50"
          >
            For NSW Civil Contractors
          </motion.p>

          {/* Main headline - cinematic typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Every lost docket
            <br />
            <span className="font-normal italic text-white/40">costs you $4,700</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-8 max-w-2xl text-lg text-white/50 sm:text-xl"
          >
            Paper dockets get lost. Disputes get expensive.
            SiteProof gives you irrefutable proof of every hour worked,
            every meter laid, every dollar earned.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-full bg-white px-10 text-base font-medium text-black hover:bg-white/90"
              )}
            >
              Start free trial
            </Link>
            <button className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Play className="h-3 w-3 fill-white text-white" />
              </span>
              Watch the story
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest text-white/30">Scroll</span>
            <ArrowDown className="h-4 w-4 text-white/30" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
