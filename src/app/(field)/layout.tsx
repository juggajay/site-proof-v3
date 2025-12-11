import { FieldHeader } from "@/components/layouts/field-header";
import { BottomNav } from "@/components/layouts/bottom-nav";

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <FieldHeader />

      {/* Page content - with bottom padding for nav */}
      <main className="pb-20">{children}</main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
