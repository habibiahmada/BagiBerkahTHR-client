# Frontend Structure Documentation

## 📁 Struktur Lengkap

```
frontend/
├── app/                          # Next.js 16 App Router
│   ├── create/                   # Flow pembuatan amplop
│   │   └── page.tsx             # Main create page
│   ├── claim/                    # Flow klaim THR
│   │   └── [token]/
│   │       └── page.tsx         # Claim page dengan token
│   ├── envelope/                 # Detail & management amplop
│   │   └── [id]/
│   │       └── page.tsx         # Envelope detail (coming soon)
│   ├── layout.tsx               # Root layout dengan metadata
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles & Tailwind
│   └── favicon.ico              # App icon
│
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx           # Button dengan variants
│   │   ├── input.tsx            # Input field
│   │   ├── card.tsx             # Card container
│   │   ├── select.tsx           # Select dropdown
│   │   └── label.tsx            # Form label
│   ├── charts/                  # Chart components (coming soon)
│   │   ├── pie-chart.tsx        # Pie chart untuk allocation
│   │   └── bar-chart.tsx        # Bar chart comparison
│   └── animations/              # Animation components (coming soon)
│       ├── envelope.tsx         # Envelope opening animation
│       └── confetti.tsx         # Confetti effect
│
├── lib/                         # Utilities & helpers
│   ├── api.ts                   # API client (centralized)
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
│
├── hooks/                       # Custom React hooks
│   ├── useEnvelope.ts          # Envelope data management
│   └── useClaim.ts             # Claim data management
│
├── public/                      # Static assets
│   ├── images/                  # Images (coming soon)
│   └── icons/                   # Icons (coming soon)
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies & scripts
└── README.md                    # Documentation
```

## 🎯 Penjelasan Setiap Folder

### `/app` - Next.js App Router

Menggunakan App Router (Next.js 16) untuk routing dan layouts.

**Key Files:**
- `layout.tsx`: Root layout dengan font, metadata, dan global styles
- `page.tsx`: Landing page dengan hero, features, dan CTA
- `create/page.tsx`: Multi-step form untuk buat amplop
- `claim/[token]/page.tsx`: Dynamic route untuk klaim dengan token

**Routing:**
- `/` → Landing page
- `/create` → Create envelope flow
- `/claim/[token]` → Claim page (dynamic)
- `/envelope/[id]` → Envelope detail (coming soon)

### `/components` - React Components

Komponen reusable yang digunakan di berbagai halaman.

**`/ui`** - Base UI Components:
- Komponen dasar seperti Button, Input, Card
- Menggunakan Tailwind CSS untuk styling
- Consistent design system
- Accessible dan responsive

**`/charts`** (Coming Soon):
- Recharts integration
- Pie chart untuk AI allocation
- Bar chart untuk comparison

**`/animations`** (Coming Soon):
- Framer Motion atau CSS animations
- Envelope opening effect
- Confetti celebration

### `/lib` - Libraries & Utilities

**`api.ts`** - API Client:
```typescript
// Centralized API calls
api.createEnvelope(data)
api.getAIAllocation(data)
api.getClaim(token)
```

**`types.ts`** - Type Definitions:
```typescript
// Shared types
type AgeLevel = 'child' | 'teen' | 'adult'
interface Recipient { ... }
interface Envelope { ... }
```

**`utils.ts`** - Helper Functions:
```typescript
// Utility functions
formatCurrency(amount)
formatDate(date)
copyToClipboard(text)
```

### `/hooks` - Custom Hooks

**`useEnvelope.ts`**:
- Fetch envelope data
- Create envelope
- Update envelope

**`useClaim.ts`**:
- Fetch claim data
- Submit claim
- Validate QR

### `/public` - Static Assets

- Images, icons, fonts
- Served directly dari root URL
- Optimized dengan Next.js Image

## 🔄 Data Flow

### Create Envelope Flow

```
User Input → Validation → API Call → Backend
                                    ↓
                              AI Processing
                                    ↓
                            Return Allocation
                                    ↓
                          Display Visualization
                                    ↓
                          User Confirms/Edits
                                    ↓
                          Choose Distribution Mode
                                    ↓
                    Payment (Digital) / Generate Links (Cash)
```

### Claim Flow

```
User Opens Link → Fetch Claim Data → Display Envelope
                                           ↓
                                    User Taps Envelope
                                           ↓
                                      Mini Quiz
                                           ↓
                                    Reveal Amount
                                           ↓
                          Choose Method (Digital/Cash)
                                           ↓
                    Transfer (Digital) / Show QR (Cash)
```

## 🎨 Styling Convention

### Tailwind Classes

```tsx
// Spacing
className="p-4 m-2 space-y-4"

// Colors
className="bg-green-600 text-white"

// Responsive
className="w-full md:w-1/2 lg:w-1/3"

// States
className="hover:bg-green-700 focus:ring-2"
```

### Component Variants

```tsx
<Button variant="default" size="lg">
<Button variant="outline" size="sm">
<Button variant="ghost">
```

## 📝 Naming Conventions

### Files
- Components: PascalCase (`Button.tsx`)
- Utilities: camelCase (`utils.ts`)
- Pages: lowercase (`page.tsx`)

### Variables
- Components: PascalCase (`const MyComponent`)
- Functions: camelCase (`const handleClick`)
- Constants: UPPER_SNAKE_CASE (`const API_URL`)

### Types
- Interfaces: PascalCase (`interface User`)
- Types: PascalCase (`type Status`)
- Enums: PascalCase (`enum Role`)

## 🚀 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/nama-fitur
   ```

2. **Develop**
   - Buat component di `/components`
   - Buat page di `/app`
   - Tambah types di `/lib/types.ts`
   - Tambah API calls di `/lib/api.ts`

3. **Test**
   ```bash
   pnpm dev
   # Test di browser
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add feature"
   ```

## 🔧 Configuration Files

### `next.config.ts`
- Next.js configuration
- Image optimization
- Environment variables

### `tsconfig.json`
- TypeScript compiler options
- Path aliases (`@/*`)
- Strict mode enabled

### `tailwind.config.ts`
- Custom colors
- Custom fonts
- Plugins

## 📦 Dependencies

### Production
- `next`: Framework
- `react`: UI library
- `recharts`: Charts
- `qrcode.react`: QR generation
- `html5-qrcode`: QR scanning
- `react-hook-form`: Forms
- `zod`: Validation

### Development
- `typescript`: Type checking
- `tailwindcss`: Styling
- `eslint`: Linting

## 🎯 Next Implementation Steps

1. **AI Allocation Page**
   - Integrate dengan backend AI API
   - Implement Recharts visualization
   - Add manual edit functionality

2. **Payment Integration**
   - Mayar gateway setup
   - Payment flow implementation
   - Webhook handling

3. **QR Features**
   - QR code generation
   - Scanner implementation
   - Real-time validation

4. **Animations**
   - Envelope opening animation
   - Confetti effect
   - Smooth page transitions

5. **Dashboard**
   - Envelope list
   - Status tracking
   - Analytics

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Recharts](https://recharts.org/en-US)
