import Link from "next/link";
import { Moon } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/20 py-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-md bg-gradient-hero flex items-center justify-center">
                                <Moon className="w-3 h-3 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-foreground">BagiBerkah</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Platform AI untuk membagikan THR secara adil, personal, dan
                            menyenangkan. Digital maupun cash.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-bold text-foreground text-sm mb-3">
                            Navigasi
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/create"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Buat Amplop
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/claim/demo"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Demo Klaim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="font-bold text-foreground text-sm mb-3">
                            Informasi
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <span className="hover:text-foreground transition-colors cursor-pointer">
                                    Kebijakan Privasi
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-foreground transition-colors cursor-pointer">
                                    Syarat &amp; Ketentuan
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-foreground transition-colors cursor-pointer">
                                    Hubungi Kami
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        © 2026 BagiBerkah. Membuat setiap THR lebih bermakna 🌙
                    </p>
                </div>
            </div>
        </footer>
    );
}
