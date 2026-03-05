"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Moon, Star, Gift, ArrowRight, ShieldCheck, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.07]">
                <Image
                    src="/hero-pattern.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-background/50 via-background/80 to-background" />

            <div className="container relative mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary-lighter px-4 py-1.5 mb-6">
                            <Moon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Ramadhan 2026
                            </span>
                            <Star className="w-3 h-3 text-secondary" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                            <span className="text-foreground">Bagikan THR</span>
                            <br />
                            <span className="text-gradient-hero">Lebih Bermakna</span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                            Platform AI yang membantu keluarga membagikan THR secara{" "}
                            <span className="font-semibold text-foreground">adil</span>,{" "}
                            <span className="font-semibold text-foreground">personal</span>,
                            dan{" "}
                            <span className="font-semibold text-foreground">
                                menyenangkan
                            </span>
                            . Digital maupun cash, untuk semua usia.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/create">
                                <Button variant="hero" size="lg">
                                    <Gift className="w-5 h-5" />
                                    Buat Amplop THR
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/claim/1e0834720a734e36ea2f5db4b4ec39c16cdcbf619e7295ebdbf59c8c9dee42c2">
                                <Button variant="outline" size="lg">
                                    Coba Klaim Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span>Aman &amp; Tervalidasi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-primary" />
                                <span>AI-Powered</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Envelope illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden lg:flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute -inset-8 rounded-full bg-linear-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl" />
                            <Image
                                src="/envelope-3d.png"
                                alt="Amplop THR BagiBerkah"
                                width={320}
                                height={320}
                                className="relative animate-float drop-shadow-2xl"
                                priority
                            />
                            <motion.div
                                className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Star className="w-4 h-4 text-secondary-foreground" />
                            </motion.div>
                            <motion.div
                                className="absolute -bottom-2 -left-6 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            >
                                <Moon className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
