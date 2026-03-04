"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";

interface Testimonial {
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        name: "Ibu Ratna",
        role: "Ibu Rumah Tangga, Jakarta",
        avatar: "R",
        quote:
            "Tahun ini bagi THR jadi lebih mudah dan adil. Anak-anak senang banget buka amplop digitalnya!",
        rating: 5,
    },
    {
        name: "Pak Hendra",
        role: "Pengusaha, Surabaya",
        avatar: "H",
        quote:
            "Fitur AI-nya luar biasa. Saya nggak perlu pusing mikirin nominal untuk 15 keponakan lagi.",
        rating: 5,
    },
    {
        name: "Dina Pratiwi",
        role: "Karyawan Swasta, Bandung",
        avatar: "D",
        quote:
            "Mode cash-nya genius! Tetap bisa kasih uang langsung tapi ada validasi digitalnya.",
        rating: 5,
    },
    {
        name: "Mas Fajar",
        role: "Freelancer, Yogyakarta",
        avatar: "F",
        quote:
            "Adik kecil saya sampai replay animasi buka amplopnya berkali-kali. Momen Lebaran jadi lebih seru!",
        rating: 5,
    },
    {
        name: "Bu Sari",
        role: "Guru, Semarang",
        avatar: "S",
        quote:
            "Greeting AI-nya personal banget, tiap anak dapat pesan berbeda. Mereka merasa sangat dihargai.",
        rating: 5,
    },
    {
        name: "Rizky Ananda",
        role: "Mahasiswa, Malang",
        avatar: "A",
        quote:
            "Pertama kali klaim THR digital, seru banget ada quiz Ramadhan-nya. Nggak sabar tahun depan!",
        rating: 4,
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Dipercaya Ribuan Keluarga"
                    subtitle="Dengarkan cerita mereka yang sudah merasakan pengalaman berbagi THR yang lebih bermakna."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                            className="rounded-2xl bg-card p-6 shadow-soft border border-border relative"
                        >
                            <Quote className="w-8 h-8 text-primary/15 absolute top-4 right-4" />
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-foreground text-sm">
                                        {t.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star
                                        key={j}
                                        className="w-3.5 h-3.5 fill-secondary text-secondary"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
