"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: {
        icon: LucideIcon;
        text: string;
    };
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    badge,
    className,
}: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center mb-12 ${className ?? ""}`}
        >
            {badge && (
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-lighter px-4 py-1.5 mb-4">
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{badge.text}</span>
                </div>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
