"use client";

import { SectionHeader } from "@/components/layout/section-header";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

interface FaqItem {
    q: string;
    a: string;
}

const faqs: FaqItem[] = [
    {
        q: "Apakah BagiBerkah aman digunakan?",
        a: "Ya, sangat aman. BagiBerkah bukan dompet digital dan tidak menyimpan dana Anda. Kami hanya mengorkestrasi transaksi melalui payment gateway resmi yang sudah PCI DSS compliant. Semua data dienkripsi dan token klaim bersifat one-time use.",
    },
    {
        q: "Bagaimana AI menentukan pembagian THR?",
        a: "AI kami menganalisis tiga faktor utama: usia penerima, status (sekolah/kuliah/bekerja), dan kedekatan hubungan. Hasil rekomendasi ditampilkan dalam grafik transparan, dan Anda tetap bisa mengedit nominal secara manual sebelum konfirmasi.",
    },
    {
        q: "Apakah bisa memberi THR secara cash (uang fisik)?",
        a: "Tentu! Mode Cash memungkinkan Anda membuat amplop digital tanpa melibatkan payment gateway. Penerima tetap mendapat pengalaman interaktif, lalu sistem menghasilkan QR token yang Anda scan saat bertemu langsung sebagai validasi.",
    },
    {
        q: "Apakah penerima perlu menginstal aplikasi?",
        a: "Tidak perlu. Penerima cukup membuka link klaim di browser HP mereka. Tidak perlu download atau registrasi apapun.",
    },
    {
        q: "Berapa biaya menggunakan BagiBerkah?",
        a: "BagiBerkah gratis untuk digunakan hingga 10 penerima. Untuk fitur premium dan jumlah penerima tak terbatas, tersedia paket berlangganan yang terjangkau.",
    },
    {
        q: "Apakah cocok untuk anak-anak yang belum punya rekening?",
        a: "Sangat cocok! Gunakan Mode Cash untuk anak-anak. Mereka tetap mendapat pengalaman seru membuka amplop digital dan menjawab quiz, tanpa perlu rekening atau e-wallet.",
    },
];

export function FaqSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <SectionHeader
                    title="Pertanyaan Umum"
                    subtitle="Jawaban untuk pertanyaan yang sering ditanyakan"
                />

                <Accordion type="single" collapsible>
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`faq-${i}`}>
                            <AccordionTrigger>{faq.q}</AccordionTrigger>
                            <AccordionContent>{faq.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
