"use client";

import { motion } from "framer-motion";
import { X, Check, Zap } from "lucide-react";

const comparisons = [
  {
    problem: "Excel Spreadsheets",
    pain: "Manual data entry, version chaos, no audit trail",
    solution: "Auto-calculated costs with full audit history",
  },
  {
    problem: "Generic PM Tools",
    pain: "Don't understand lots, linear meters, or civil quantities",
    solution: "Purpose-built for civil with native lot tracking",
  },
  {
    problem: "Paper Dockets",
    pain: "Lost, disputed, no evidence of actual work done",
    solution: "GPS-stamped, photo-verified digital dockets",
  },
  {
    problem: "Manual SOPA Claims",
    pain: "Days of compiling, missed deadlines, rejected claims",
    solution: "One-click SOPA claims with supporting evidence",
  },
  {
    problem: "Guessing EBA Rates",
    pain: "Underpaying risks disputes, overpaying kills margin",
    solution: "Auto-calculated EBA rates with frozen rate support",
  },
];

export function ComparisonSection() {
  return (
    <section className="relative bg-black py-24 sm:py-32">
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-mono-data text-sm uppercase tracking-[0.3em] text-white/40">
            The Difference
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            What you're replacing
          </h2>
        </motion.div>

        {/* Comparison grid */}
        <div className="space-y-3">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group"
            >
              <div className="grid overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] md:grid-cols-2">
                {/* Problem side */}
                <div className="relative border-b border-white/[0.08] p-5 md:border-b-0 md:border-r">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <X className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">{item.problem}</p>
                      <p className="mt-0.5 text-xs text-white/30">{item.pain}</p>
                    </div>
                  </div>
                </div>

                {/* Solution side */}
                <div className="relative p-5 transition-colors duration-300 group-hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
        >
          {[
            { value: "2hrs", label: "Average setup time" },
            { value: "90%", label: "Fewer disputes" },
            { value: "$47K", label: "Monthly savings" },
          ].map((stat, i) => (
            <div key={i} className="bg-black p-8 text-center">
              <p className="font-mono-data text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
