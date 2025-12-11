"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FileX, MessageSquareWarning, DollarSign, Camera, CheckCircle2, Smartphone } from "lucide-react";

const chapters = [
  {
    id: "chapter-1",
    time: "5:47pm Friday",
    title: "The Docket",
    content: `Your foreman just finished a 12-hour day on the Parramatta job. 47 dockets written by hand. Stuffed in the glovebox. You won't see them until Monday—if they don't blow out the window first.`,
    visual: "paper",
    icon: FileX,
    color: "text-white/60",
  },
  {
    id: "chapter-2",
    time: "3 weeks later",
    title: "The Email",
    content: `"We have no record of this work being completed on Lot 47." The client disputes $23,000. You know it was done. Your crew knows it was done. But paper doesn't remember.`,
    visual: "email",
    icon: MessageSquareWarning,
    color: "text-amber-400",
  },
  {
    id: "chapter-3",
    time: "The cost",
    title: "The Loss",
    content: `Without timestamped photos, without GPS coordinates, without a digital trail—you lose. Not because the work wasn't done. Because you couldn't prove it.`,
    visual: "money",
    icon: DollarSign,
    color: "text-red-400",
  },
];

function Chapter({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex min-h-[80vh] items-center py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={index % 2 === 1 ? "lg:order-2" : ""}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 ${chapter.color}`}>
              <chapter.icon className="h-5 w-5" />
            </div>
            <span className="font-mono-data text-sm uppercase tracking-wider text-white/40">
              {chapter.time}
            </span>
          </div>

          <h2 className="text-3xl font-light text-white sm:text-4xl lg:text-5xl">
            {chapter.title}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/50 lg:text-xl">
            {chapter.content}
          </p>
        </motion.div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}
        >
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {chapter.visual === "paper" && (
              <div className="flex h-full items-center justify-center p-8">
                <motion.div
                  animate={isInView ? { rotate: [-2, 2, -2] } : {}}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative"
                >
                  {/* Stack of paper dockets */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-48 w-36 rounded-lg bg-amber-50 shadow-lg sm:h-64 sm:w-48"
                      style={{
                        transform: `rotate(${(i - 2) * 5}deg) translateY(${i * 2}px)`,
                        zIndex: 5 - i,
                      }}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="h-2 w-16 rounded bg-gray-300" />
                        <div className="mt-2 h-2 w-24 rounded bg-gray-200" />
                        <div className="mt-4 space-y-2">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-1.5 w-full rounded bg-gray-200" />
                          ))}
                        </div>
                        <div className="mt-4 h-12 w-full rounded bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {chapter.visual === "email" && (
              <div className="flex h-full items-center justify-center p-6">
                <div className="w-full max-w-sm rounded-xl bg-surface-2 p-4 shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="h-8 w-8 rounded-full bg-red-500/20" />
                    <div>
                      <div className="text-sm font-medium text-white">Payment Dispute</div>
                      <div className="text-xs text-white/40">claims@bigclient.com.au</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-white/70">
                      Re: Invoice #4721 - Lot 47 Earthworks
                    </p>
                    <p className="text-sm leading-relaxed text-white/50">
                      "We have reviewed our records and cannot verify the completion of works claimed on 15th November. Without supporting documentation, we are unable to process this payment of <span className="font-semibold text-red-400">$23,450</span>."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {chapter.visual === "money" && (
              <div className="relative flex h-full items-center justify-center overflow-hidden">
                <motion.div
                  animate={isInView ? { y: [0, 100] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex h-16 w-32 items-center justify-center rounded-lg bg-gradient-to-r from-green-900/40 to-green-800/40 font-mono-data text-2xl font-bold text-green-400/50"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      $4,700
                    </motion.div>
                  ))}
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
                <span className="relative z-10 font-mono-data text-5xl font-bold text-red-400 sm:text-6xl">
                  -$47,000
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function TheSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-black via-primary/5 to-black py-32"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/20 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono-data text-sm uppercase tracking-[0.3em] text-primary">
            What if
          </span>

          <h2 className="mt-6 text-4xl font-light leading-tight text-white sm:text-5xl lg:text-7xl">
            Every docket had
            <br />
            <span className="font-normal text-primary">irrefutable proof?</span>
          </h2>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 max-w-sm"
        >
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute -inset-8 rounded-[3rem] bg-primary/30 blur-3xl" />

            {/* Phone frame */}
            <div className="relative overflow-hidden rounded-[3rem] border-4 border-white/20 bg-surface-1 shadow-2xl">
              <div className="flex items-center justify-center border-b border-white/10 bg-surface-2 py-3">
                <div className="h-6 w-24 rounded-full bg-surface-4" />
              </div>
              <div className="aspect-[9/16] bg-surface-1 p-4">
                {/* Docket submission UI */}
                <div className="rounded-2xl border border-white/10 bg-surface-2 p-4">
                  <div className="text-left">
                    <p className="text-xs text-white/40">Lot 47 · Parramatta</p>
                    <p className="mt-1 font-semibold text-white">Earthworks Complete</p>
                  </div>

                  {/* Photo */}
                  <div className="mt-4 aspect-video rounded-xl bg-gradient-to-br from-amber-900/50 to-amber-800/30 p-3">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-white/60" />
                      <span className="text-xs text-white/60">Photo attached</span>
                    </div>
                    <div className="mt-2 text-[10px] text-white/40">
                      GPS: -33.8152, 151.0012
                      <br />
                      15 Nov 2024, 5:43pm
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-white/60">Claim amount</span>
                    <span className="font-mono-data text-lg font-bold text-emerald-400">$23,450</span>
                  </div>
                </div>

                {/* Submit button */}
                <motion.div
                  animate={isInView ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 rounded-xl bg-primary py-4 text-center font-semibold text-black"
                >
                  Submit Docket
                </motion.div>

                {/* Confirmation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="mt-4 flex items-center justify-center gap-2 text-emerald-400"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Synced with office</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefit pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {["GPS Coordinates", "Timestamped Photos", "Digital Signatures", "Offline Sync"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function StorySection() {
  return (
    <section className="relative bg-black">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      {/* Chapters */}
      {chapters.map((chapter, index) => (
        <Chapter key={chapter.id} chapter={chapter} index={index} />
      ))}

      {/* The Solution */}
      <TheSolution />
    </section>
  );
}
