"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, HardHat, ArrowRight, CheckCircle2, Quote } from "lucide-react";

const personas = {
  manager: {
    icon: Briefcase,
    label: "For Owners & PMs",
    title: "Know Your Margin at 5pm. Not Month-End.",
    description:
      "Real-time dashboards show exactly where money is being spent across every project, lot, and resource. Generate SOPA claims in minutes. Verify every invoice against approved rates.",
    image: "https://placehold.co/900x600/0a0a0a/3b82f6?text=Cost+Dashboard",
    imageAlt: "SiteProof Cost Dashboard",
    benefits: [
      "Daily profit/loss per lot",
      "Auto SOPA claim generation",
      "Invoice vs docket matching",
      "Resource utilization reports",
    ],
    testimonial: {
      quote: "We recovered $180K in the first 3 months from disputes we would have lost without photo evidence.",
      author: "James Morrison",
      role: "Director, Morrison Civil Pty Ltd",
      location: "Penrith, NSW",
    },
    color: "from-blue-500/20 to-cyan-500/20",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
  },
  foreman: {
    icon: HardHat,
    label: "For Foremen",
    title: "3 Taps to Submit. Works Offline.",
    description:
      "Built for blokes on site, not accountants in the office. Capture dockets with GPS-stamped photos. Submit timesheets with EBA rates pre-calculated. Works when there's no signal.",
    image: "https://placehold.co/400x700/0a0a0a/22c55e?text=Field+App",
    imageAlt: "SiteProof Field App",
    benefits: [
      "Offline-first operation",
      "3-tap docket submission",
      "Auto EBA rate calculation",
      "GPS-stamped photos",
    ],
    testimonial: {
      quote: "My boys actually use it. First system that doesn't make them want to throw their phone in the excavator.",
      author: "Steve Chen",
      role: "Site Foreman, Chen Infrastructure",
      location: "Parramatta, NSW",
    },
    color: "from-emerald-500/20 to-green-500/20",
    accentColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
  },
};

export function PersonaSwitcher() {
  const [activePersona, setActivePersona] = useState<"manager" | "foreman">("manager");
  const persona = personas[activePersona];

  return (
    <section className="relative overflow-hidden bg-surface-1 py-24 sm:py-32">
      {/* Animated background */}
      <motion.div
        key={activePersona}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className={`absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r ${persona.color} to-transparent blur-3xl opacity-20`} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-xl"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Two Interfaces, One Platform
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="text-gradient">Everyone on Your Team</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="inline-flex rounded-2xl border border-white/10 bg-surface-2/50 p-2 backdrop-blur-sm">
            {(["manager", "foreman"] as const).map((key) => {
              const p = personas[key];
              const isActive = activePersona === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePersona(key)}
                  className={`relative flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="persona-bg"
                      className="absolute inset-0 rounded-xl bg-surface-4 shadow-lg"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <p.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{p.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
          >
            {/* Text */}
            <div className={activePersona === "foreman" ? "lg:order-2" : ""}>
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full ${persona.bgAccent} px-4 py-2 text-sm font-medium ${persona.accentColor}`}>
                <persona.icon className="h-4 w-4" />
                {persona.label}
              </div>

              <h3 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                {persona.title}
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {persona.description}
              </p>

              <ul className="mt-8 space-y-3">
                {persona.benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${persona.bgAccent}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${persona.accentColor}`} />
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 rounded-xl border border-white/10 bg-surface-2/50 p-5"
              >
                <Quote className={`h-6 w-6 ${persona.accentColor} opacity-50`} />
                <p className="mt-3 text-sm leading-relaxed italic">"{persona.testimonial.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${persona.bgAccent} font-semibold ${persona.accentColor}`}>
                    {persona.testimonial.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{persona.testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{persona.testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{persona.testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className={activePersona === "foreman" ? "lg:order-1" : ""}>
              <div className="relative">
                <div className={`absolute inset-0 -z-10 translate-y-4 rounded-3xl bg-gradient-to-r ${persona.color} blur-3xl opacity-40`} />

                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`overflow-hidden rounded-2xl border border-white/15 bg-surface-2 shadow-2xl ${
                    activePersona === "foreman" ? "mx-auto max-w-xs" : ""
                  }`}
                >
                  {activePersona === "manager" && (
                    <div className="flex items-center gap-2 border-b border-white/10 bg-surface-3 px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="ml-3 flex-1 rounded bg-surface-4 px-3 py-1">
                        <span className="font-mono-data text-[10px] text-muted-foreground">
                          app.siteproof.com.au/costs
                        </span>
                      </div>
                    </div>
                  )}

                  {activePersona === "foreman" && (
                    <div className="flex items-center justify-center border-b border-white/10 bg-surface-3 py-3">
                      <div className="h-5 w-20 rounded-full bg-surface-4" />
                    </div>
                  )}

                  <img src={persona.image} alt={persona.imageAlt} className="w-full" />
                </motion.div>

                {/* Floating cards */}
                {activePersona === "manager" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-4 -left-4 hidden lg:block"
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="rounded-xl border border-white/10 bg-surface-2/95 p-3 shadow-xl backdrop-blur-xl"
                    >
                      <p className="text-xs text-muted-foreground">SOPA Claim Ready</p>
                      <p className="font-mono-data text-lg font-bold text-emerald-400">$847,230</p>
                    </motion.div>
                  </motion.div>
                )}

                {activePersona === "foreman" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -right-4 -top-4 hidden lg:block"
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="rounded-xl border border-emerald-500/30 bg-surface-2/95 p-3 shadow-xl backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">Synced</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
