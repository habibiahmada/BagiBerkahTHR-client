import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-muted text-foreground",
    success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
