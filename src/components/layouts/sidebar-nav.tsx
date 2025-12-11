"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Truck,
  Receipt,
  FileBarChart,
  User,
  HardHat,
  Building2,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Building2,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: Truck,
  },
  {
    title: "ITP Library",
    href: "/library",
    icon: ClipboardList,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <HardHat className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
          CivilOS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:-translate-y-0.5 hover:bg-sidebar-accent",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent">
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>
      </div>
    </aside>
  );
}
