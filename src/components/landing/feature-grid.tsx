"use client";

import { motion } from "framer-motion";
import {
  Users,
  Calculator,
  CheckCircle2,
  FileBarChart,
  ShieldCheck,
  Wifi,
  Clock,
  Camera,
} from "lucide-react";

const features = [
  {
    icon: FileBarChart,
    title: "SOPA Payment Claims",
    description:
      "Generate Security of Payment Act compliant claims with one click. Every docket, photo, and signature automatically compiled.",
    stat: "3 clicks",
    statLabel: "Not 3 days",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/50",
    highlight: true,
  },
  {
    icon: Calculator,
    title: "EBA Rate Engine",
    description:
      "Automatic calculation of frozen rates, site allowances, and overtime. Never underpay or overpay your crew again.",
    stat: "$0",
    statLabel: "Rate errors",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "group-hover:border-emerald-500/50",
  },
  {
    icon: Camera,
    title: "Photo-Verified Dockets",
    description:
      "GPS-stamped photos attached to every docket. Eliminate disputes with irrefutable evidence of work completed.",
    stat: "Zero",
    statLabel: "Disputed dockets",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "group-hover:border-amber-500/50",
  },
  {
    icon: Clock,
    title: "Real-Time Daily Costing",
    description:
      "Know your margin at 5pm, not month-end. Instant visibility into labour, plant, and material costs per lot.",
    stat: "Live",
    statLabel: "Not lagging",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "group-hover:border-purple-500/50",
  },
];

const additionalFeatures = [
  {
    icon: Wifi,
    title: "Offline-First",
    description: "Works on remote NSW sites. Syncs when back in range.",
  },
  {
    icon: ShieldCheck,
    title: "Hold Points & ITPs",
    description: "NATA-ready quality documentation. Pass any audit.",
  },
  {
    icon: Users,
    title: "No Ticket, No Start",
    description: "Block non-compliant workers. 100% site compliance.",
  },
];

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export function FeatureGrid() {
  return (
    <section id="features" className="relative bg-surface-0 py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-1 via-transparent to-surface-1" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-16 grid gap-6 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for NSW Civil
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Every Feature Built for{" "}
              <span className="text-gradient-blue">NSW Compliance</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:pt-8"
          >
            <p className="text-lg text-muted-foreground">
              Generic PM tools don't understand SOPA deadlines, EBA frozen rates, or civil quantities.
              SiteProof was built by NSW contractors, for NSW contractors.
            </p>
          </motion.div>
        </div>

        {/* Main feature grid */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-2xl border bg-surface-1 p-6 transition-all duration-300 hover:bg-surface-2 lg:p-8 ${
                feature.highlight
                  ? "border-primary/30 ring-1 ring-primary/20"
                  : "border-white/10"
              } ${feature.borderColor}`}
            >
              {/* Highlight badge */}
              {feature.highlight && (
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Hover gradient */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} to-transparent`} />
              </div>

              <div className="relative flex h-full flex-col">
                {/* Icon and stat */}
                <div className="flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <div className="text-right">
                    <p className={`font-mono-data text-2xl font-bold ${feature.color}`}>
                      {feature.stat}
                    </p>
                    <p className="text-xs text-muted-foreground">{feature.statLabel}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 flex-1">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="mt-6 h-1 w-0 rounded-full bg-gradient-to-r from-primary via-primary to-cyan-400 transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid gap-4 sm:grid-cols-3 lg:gap-6"
        >
          {additionalFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group flex items-start gap-4 rounded-xl border border-white/10 bg-surface-1/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-surface-2/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
