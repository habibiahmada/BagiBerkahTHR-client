# Installation Guide - BagiBerkah Frontend

## Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend

# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Install Additional Required Packages

The following packages need to be installed manually:

```bash
# Chart library for AI allocation visualization
pnpm add recharts

# QR Code libraries
pnpm add qrcode.react html5-qrcode

# Confetti animation
pnpm add canvas-confetti

# Type definitions
pnpm add -D @types/canvas-confetti
```

Or all at once:

```bash
pnpm add recharts qrcode.react html5-qrcode canvas-confetti
pnpm add -D @types/canvas-confetti
```

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
pnpm dev -- -p 3001
```

### Dependencies Issues

If you encounter dependency issues:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

### TypeScript Errors

Make sure all dependencies are installed:

```bash
pnpm install
```

## Package Versions

The project uses the following key packages:

- **Next.js**: 16.1.6
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x
- **Recharts**: 2.15.0
- **qrcode.react**: 4.1.0
- **html5-qrcode**: 2.3.8
- **canvas-confetti**: Latest
- **Framer Motion**: 12.35.0
- **Lucide React**: 0.577.0

## Features Implemented

✅ Landing Page with all sections
✅ Create Envelope Flow (3 steps)
✅ AI Allocation with Visualization (Pie, Bar, Table)
✅ Manual Edit Modal
✅ Mode Selection (Digital/Cash)
✅ Payment Integration
✅ Complete Claim Flow
✅ QR Code Generation & Scanning
✅ Bank Account Form
✅ Dashboard with Statistics
✅ Envelope Detail with Tracking
✅ Payment Success/Failed Pages
✅ Confetti Animation
✅ Toast Notifications
✅ All UI Components

## Next Steps

1. Make sure backend is running on port 5000
2. Test the complete flow from create to claim
3. Verify AI allocation integration
4. Test payment flow (use mock mode if needed)
5. Test QR code scanning for cash mode

## Support

For issues or questions, check:
- `README.md` - Main documentation
- `STRUCTURE.md` - Project structure
- `API_INTEGRATION.md` - API integration guide
- Backend API documentation

---

**Status**: MVP Complete ✅
**Last Updated**: March 2026
