"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "OpenAI",
    logo: "/openai-logo.png",
    description: "AI Allocation & Personalization",
  },
  {
    name: "Xendit",
    logo: "/xendit-logo.png",
    description: "Payment Gateway",
  },
  {
    name: "Mayar",
    logo: "/mayar-logo.png",
    description: "Donation Platform",
  },
  {
    name: "Kiro",
    logo: "/kiro-logo.png",
    description: "AI Development IDE",
  },
  {
    name: "Lovable",
    logo: "/lovable-logo.png",
    description: "Design & Prototyping",
  },
];

export function PoweredBySection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Dikembangkan dengan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dibangun dengan teknologi terbaik dari partner terpercaya
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-background hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative w-full h-16 mb-3 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    console.error(`Failed to load: ${partner.logo}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                {partner.name}
              </p>
              <p className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

