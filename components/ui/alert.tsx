import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

export function Alert({
  variant = "default",
  className,
  children,
  ...props
}: AlertProps) {
  const variants = {
    default: "bg-muted text-foreground",
    success: "bg-green-50 text-green-900 border-green-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    error: "bg-red-50 text-red-900 border-red-200",
    info: "bg-blue-50 text-blue-900 border-blue-200",
  };

  const icons = {
    default: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex gap-3",
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function AlertTitle({
  className,
  children,
  ...props
}: AlertTitleProps) {
  return (
    <h5 className={cn("font-semibold mb-1", className)} {...props}>
      {children}
    </h5>
  );
}

interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function AlertDescription({
  className,
  children,
  ...props
}: AlertDescriptionProps) {
  return (
    <p className={cn("text-sm", className)} {...props}>
      {children}
    </p>
  );
}
