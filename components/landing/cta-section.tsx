"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Moon, Star, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative rounded-3xl bg-gradient-hero p-10 md:p-16 text-center overflow-hidden"
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-[0.15]">
                        <Image
                            src="/moon.png"
                            alt=""
                            fill
                            className="object-cover rounded-3xl"
                            priority
                        />
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-6 left-10 w-16 h-16 rounded-full border-2 border-primary-foreground/30" />
                        <div className="absolute bottom-8 right-12 w-24 h-24 rounded-full border-2 border-primary-foreground/20" />
                        <div className="absolute top-1/2 right-1/4 w-8 h-8 rounded-full bg-primary-foreground/10" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Moon className="w-6 h-6 text-primary-foreground/80" />
                            <Star className="w-4 h-4 text-primary-foreground/60" />
                            <Moon className="w-4 h-4 text-primary-foreground/60" />
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">
                            Siap Berbagi THR
                            <br />
                            yang Lebih Bermakna?
                        </h2>
                        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                            Bergabung dengan ribuan keluarga Indonesia yang sudah merasakan
                            cara baru berbagi THR. Gratis untuk memulai.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/create">
                                <Button
                                    size="xl"
                                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated font-bold"
                                >
                                    <Gift className="w-5 h-5" />
                                    Buat Amplop Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/claim/demo">
                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                    Lihat Demo
                                </Button>
                            </Link>
                        </div>

                        <p className="text-primary-foreground/60 text-sm mt-6">
                            Tanpa registrasi • Gratis hingga 10 penerima • Siap pakai dalam 2
                            menit
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
