"use client";

import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { OfficeHeader } from "@/components/layouts/office-header";

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main content area - offset by sidebar width */}
      <div className="pl-64">
        {/* Top header with breadcrumbs */}
        <OfficeHeader />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
