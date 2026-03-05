"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, LayoutDashboard, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                        <Moon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg text-foreground">
                        BagiBerkah
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button
                            variant={pathname === "/dashboard" ? "default" : "ghost"}
                            size="sm"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Cek Status</span>
                        </Button>
                    </Link>
                    <Link href="/create">
                        <Button variant="hero" size="sm">
                            <Gift className="w-4 h-4" />
                            <span className="hidden sm:inline">Buat Amplop</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
