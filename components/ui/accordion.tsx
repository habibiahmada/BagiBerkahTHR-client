"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Accordion (root) ─── */
interface AccordionProps {
    type?: "single" | "multiple";
    collapsible?: boolean;
    className?: string;
    children: React.ReactNode;
}

function Accordion({ className, children }: AccordionProps) {
    return <div className={cn("space-y-3", className)}>{children}</div>;
}

/* ─── AccordionItem ─── */
interface AccordionItemProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

function AccordionItem({ className, children }: AccordionItemProps) {
    return (
        <details
            className={cn(
                "group rounded-xl border border-border bg-card px-6 transition-shadow open:shadow-soft",
                className
            )}
        >
            {children}
        </details>
    );
}

/* ─── AccordionTrigger ─── */
interface AccordionTriggerProps {
    className?: string;
    children: React.ReactNode;
}

function AccordionTrigger({ className, children }: AccordionTriggerProps) {
    return (
        <summary
            className={cn(
                "flex cursor-pointer items-center justify-between py-4 text-left font-semibold text-foreground text-sm md:text-base",
                "list-none [&::-webkit-details-marker]:hidden",
                "select-none",
                className
            )}
        >
            {children}
            <svg
                className="ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </summary>
    );
}

/* ─── AccordionContent ─── */
interface AccordionContentProps {
    className?: string;
    children: React.ReactNode;
}

function AccordionContent({ className, children }: AccordionContentProps) {
    return (
        <div
            className={cn(
                "pb-4 text-sm text-muted-foreground leading-relaxed",
                className
            )}
        >
            {children}
        </div>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
