"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldHeaderProps {
  title?: string;
  subtitle?: string;
}

export function FieldHeader({ title, subtitle }: FieldHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Show back button if not on a root field page
  const segments = pathname.split("/").filter(Boolean);
  const showBack = segments.length > 1;

  // TODO: Replace with actual online/offline detection
  const isOnline = true;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* Back button */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="touch-target flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Title */}
        <div className="flex-1">
          {title && (
            <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Connection status */}
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            isOnline ? "text-success" : "text-warning"
          )}
        >
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>Offline</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
