import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type PageShellMaxWidth = "md" | "lg" | "xl";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: PageShellMaxWidth;
};

const maxWidthClassName: Record<PageShellMaxWidth, string> = {
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export default function PageShell({
  children,
  className,
  contentClassName,
  maxWidth = "lg",
}: PageShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10",
        className,
      )}
    >
      <section
        className={cn(
          "mx-auto flex flex-col gap-5 sm:gap-6",
          maxWidthClassName[maxWidth],
          contentClassName,
        )}
      >
        {children}
      </section>
    </main>
  );
}
