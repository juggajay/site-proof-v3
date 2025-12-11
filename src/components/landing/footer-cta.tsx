"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Shield,
  Check,
  ArrowRight,
  Star,
  Quote,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

const benefits = [
  "30-Day Free Trial",
  "No Credit Card Required",
  "Cancel Anytime",
  "Sydney-Based Support",
  "Data Export Guaranteed",
];

const testimonials = [
  {
    quote: "Cut our payment disputes by 90%. The photo evidence alone has saved us hundreds of thousands.",
    author: "Michael Torres",
    role: "Managing Director",
    company: "Torres Civil Group",
    location: "Blacktown, NSW",
    stat: "$340K",
    statLabel: "saved in Year 1",
  },
  {
    quote: "My office admin went from 3 days a week on paperwork to half a day. The boys actually submit their dockets now.",
    author: "Sarah Williams",
    role: "Operations Manager",
    company: "Williams Infrastructure",
    location: "Liverpool, NSW",
    stat: "47%",
    statLabel: "less admin time",
  },
  {
    quote: "First time in 15 years I know my daily margin before I leave site. Should have done this years ago.",
    author: "David Chen",
    role: "Owner",
    company: "Chen Earthworks",
    location: "Penrith, NSW",
    stat: "Real-time",
    statLabel: "daily costing",
  },
];

const faqs = [
  {
    q: "How long does it take to get set up?",
    a: "Most NSW contractors are fully operational within 2 hours. We handle data migration from your existing systems, and our Sydney team provides hands-on onboarding for your office staff and field crews.",
  },
  {
    q: "Does it work offline on remote NSW sites?",
    a: "Yes, 100%. SiteProof was built for NSW conditions. Your foremen can capture dockets, photos, and timesheets with zero signal. Everything syncs automatically when they're back in range.",
  },
  {
    q: "Is it really SOPA compliant?",
    a: "Absolutely. Our SOPA claim generator was built with NSW construction lawyers. Every claim includes the required statutory information, supporting evidence, and is formatted to meet Security of Payment Act requirements.",
  },
  {
    q: "What about my existing EBA rates?",
    a: "We support all major NSW civil EBAs including frozen rates, site allowances, travel time, and overtime calculations. Your rates are locked in and automatically applied to every timesheet.",
  },
  {
    q: "Can I export my data if I leave?",
    a: "Yes, always. Your data belongs to you. Export everything—dockets, photos, timesheets, reports—in standard formats anytime. No lock-in, no hostage data.",
  },
  {
    q: "What support do you offer?",
    a: "Sydney-based support team available 6am-6pm weekdays. Phone, email, and screen-share support included. Most issues resolved within 2 hours.",
  },
];

export function FooterCTA() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <footer className="relative overflow-hidden bg-black">
      {/* Testimonials */}
      <section id="testimonials" className="relative border-b border-white/[0.08] py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <span className="font-mono-data text-sm uppercase tracking-[0.3em] text-white/40">
              Social Proof
            </span>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
              NSW contractors who made the switch
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all hover:border-white/20 hover:bg-white/[0.04]"
              >
                {/* Stat badge */}
                <div className="absolute right-4 top-4 text-right">
                  <p className="font-mono-data text-2xl font-bold text-primary">{t.stat}</p>
                  <p className="text-xs text-white/40">{t.statLabel}</p>
                </div>

                <Quote className="h-6 w-6 text-white/10" />
                <p className="mt-4 text-sm leading-relaxed text-white/70">"{t.quote}"</p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
                    {t.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.author}</p>
                    <p className="text-xs text-white/40">{t.role}, {t.company}</p>
                    <p className="text-xs text-white/30">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-b border-white/[0.08] py-24">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="font-mono-data text-sm uppercase tracking-[0.3em] text-white/40">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <span className="font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-white/40 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-4 text-sm leading-relaxed text-white/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 sm:py-40">
        {/* Glow effect */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/30 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono-data text-sm uppercase tracking-[0.3em] text-white/40">
              Ready?
            </span>

            <h2 className="mt-6 text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stop the bleeding.
              <br />
              <span className="text-primary">Start proving.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-xl text-lg text-white/50">
              Every lost docket costs you $4,700. Every disputed claim costs you more.
              See how SiteProof works for your NSW operation.
            </p>

            {/* Benefits */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-white/60">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="tel:1300123456"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                1300 123 456
              </Link>
            </motion.div>

            <p className="mt-8 text-sm text-white/30">
              2 hour setup · No credit card required · Sydney support team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-white/[0.08] bg-black">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">SiteProof</span>
              </div>
              <p className="mt-4 text-sm text-white/40">
                The only construction software built specifically for NSW civil contractors.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-medium text-white">Contact</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/40">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  1300 123 456
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hello@siteproof.com.au
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Sydney, NSW
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-medium text-white">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/40">
                <li><Link href="#features" className="transition-colors hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="transition-colors hover:text-white">Pricing</Link></li>
                <li><Link href="#testimonials" className="transition-colors hover:text-white">Reviews</Link></li>
                <li><Link href="/office" className="transition-colors hover:text-white">Demo</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-medium text-white">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/40">
                <li><Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="transition-colors hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="transition-colors hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 sm:flex-row">
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} SiteProof Pty Ltd. ABN 12 345 678 901.
            </p>
            <p className="text-sm text-white/30">
              Made in Sydney for NSW Civil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
