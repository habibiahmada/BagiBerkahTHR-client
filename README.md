# BagiBerkah Frontend

Frontend aplikasi BagiBerkah - AI-Powered THR Experience built with Next.js 16.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Charts**: Recharts
- **QR Code**: qrcode.react + html5-qrcode
- **Forms**: React Hook Form + Zod

## 📁 Struktur Folder

```
frontend/
├── app/                    # Next.js App Router
│   ├── create/            # Halaman buat amplop
│   ├── claim/[token]/     # Halaman klaim THR
│   ├── envelope/[id]/     # Detail amplop (coming soon)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # UI components (Button, Input, Card, dll)
│   ├── charts/            # Chart components (coming soon)
│   └── animations/        # Animation components (coming soon)
├── lib/
│   ├── api.ts             # API client
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🛠 Setup & Installation

### Prerequisites

- Node.js 18+ atau 20+
- pnpm (recommended) atau npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local dengan konfigurasi yang sesuai
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📄 Halaman Utama

### 1. Landing Page (`/`)
- Hero section dengan CTA
- Features showcase
- How it works
- Call to action

### 2. Create Envelope (`/create`)
- Step 1: Input total budget
- Step 2: Tambah penerima dengan data lengkap
- Step 3: AI allocation & visualization (coming soon)
- Step 4: Pilih mode distribusi (coming soon)
- Step 5: Payment/Generate links (coming soon)

### 3. Claim Page (`/claim/[token]`)
- Envelope opening animation
- Mini quiz Ramadhan
- Reveal nominal & greeting
- Pilih metode pencairan (digital/cash)

### 4. Envelope Detail (`/envelope/[id]`) - Coming Soon
- Status tracking
- Daftar penerima & status klaim
- QR scanner untuk mode cash
- Analytics

## 🎨 Design System

### Colors

- **Primary**: Green (#4CAF50, #81C784)
- **Secondary**: Amber (#FFD700, #FFC107)
- **Background**: White, Green-50, Amber-50
- **Text**: Gray-900, Gray-600

### Typography

- **Font**: Inter
- **Sizes**: 
  - Heading: 24-48px
  - Body: 14-16px
  - Caption: 12-14px

### Components

Semua komponen UI ada di `components/ui/`:
- Button (variants: default, outline, ghost, destructive)
- Input (dengan validation styling)
- Card (dengan Header, Content, Footer)
- Dan lainnya (coming soon)

## 🔌 API Integration

API client tersedia di `lib/api.ts` dengan methods:

```typescript
// Envelope
api.createEnvelope(data)
api.getEnvelope(id)
api.getEnvelopeStatus(id)

// AI
api.getAIAllocation(data)
api.generateGreeting(data)

// Claim
api.getClaim(token)
api.submitClaim(token, data)
api.validateQR(qrToken)

// Payment
api.createPayment(envelopeId)
api.getPaymentStatus(paymentId)
```

## 📱 Responsive Design

- **Mobile-first approach**
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 🎯 Next Steps

### Fitur yang Akan Diimplementasikan

1. **AI Allocation Page**
   - Visualisasi dengan Recharts
   - Edit manual allocation
   - Explanation dari AI

2. **Payment Integration**
   - Mayar gateway integration
   - Payment status tracking
   - Webhook handling

3. **QR Code Features**
   - Generate QR untuk mode cash
   - Scanner untuk validasi
   - Real-time validation

4. **Animations**
   - Envelope opening animation
   - Confetti effect
   - Smooth transitions

5. **Dashboard**
   - Envelope management
   - Analytics
   - History

## 🐛 Known Issues

- [ ] AI allocation belum terintegrasi dengan backend
- [ ] Payment gateway belum diimplementasikan
- [ ] QR code scanner belum diimplementasikan
- [ ] Animations masih placeholder

## 📝 Notes

- Gunakan `"use client"` directive untuk components yang butuh interactivity
- Semua API calls harus melalui `lib/api.ts`
- Gunakan TypeScript types dari `lib/types.ts`
- Follow Tailwind CSS conventions untuk styling

## 🤝 Contributing

1. Create feature branch
2. Implement feature
3. Test thoroughly
4. Create pull request

## 📄 License

Private - BagiBerkah Project
