"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ClipboardCheck, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Diary",
    href: "/diary",
    icon: ClipboardList,
  },
  {
    title: "ITPs",
    href: "/itps",
    icon: ClipboardCheck,
  },
  {
    title: "Lots",
    href: "/lots",
    icon: MapPin,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-primary")}
              />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
