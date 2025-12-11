import {
  Navbar,
  Hero,
  StorySection,
  ComparisonSection,
  FooterCTA,
} from "@/components/landing";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <StorySection />
      <ComparisonSection />
      <FooterCTA />
    </main>
  );
}
