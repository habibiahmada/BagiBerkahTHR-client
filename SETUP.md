# Setup Instructions - BagiBerkah Frontend

## 📋 Prerequisites

Pastikan sudah terinstall:

- **Node.js**: v18.x atau v20.x (recommended)
- **pnpm**: v8.x atau v9.x (recommended) atau npm
- **Git**: untuk version control

### Check Versions

```bash
node --version   # Should be v18+ or v20+
pnpm --version   # Should be v8+ or v9+
```

### Install pnpm (jika belum ada)

```bash
npm install -g pnpm
```

---

## 🚀 Installation Steps

### 1. Clone Repository (jika belum)

```bash
git clone <repository-url>
cd bagiberkah
```

### 2. Navigate to Frontend

```bash
cd frontend
```

### 3. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 4. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local
nano .env.local  # or use your preferred editor
```

**Environment Variables:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

**Important Notes:**
- `NEXT_PUBLIC_*` variables are exposed to browser
- Update `NEXT_PUBLIC_API_URL` sesuai backend URL
- Untuk production, ganti dengan URL production

### 5. Run Development Server

```bash
pnpm dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

---

## 🔧 Available Scripts

### Development

```bash
# Start development server
pnpm dev

# Development server akan auto-reload saat ada perubahan
```

### Build

```bash
# Build for production
pnpm build

# Output akan ada di folder .next/
```

### Production

```bash
# Start production server (setelah build)
pnpm start

# Server akan berjalan di port 3000
```

### Linting

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint --fix
```

---

## 📁 Project Structure Overview

```
frontend/
├── app/              # Pages & routing
├── components/       # React components
├── lib/             # Utilities & API
├── hooks/           # Custom hooks
├── public/          # Static files
└── .env.local       # Environment variables (create this)
```

---

## 🔌 Backend Integration

### Ensure Backend is Running

Frontend membutuhkan backend untuk berfungsi penuh.

```bash
# Di terminal terpisah, jalankan backend
cd ../backend
npm run dev  # atau sesuai script backend
```

Backend harus berjalan di `http://localhost:5000` (atau sesuai `NEXT_PUBLIC_API_URL`)

### Test API Connection

Buka browser console di `http://localhost:3000` dan cek:

```javascript
// Test API connection
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🎨 Development Tips

### 1. Hot Reload

Next.js akan auto-reload saat ada perubahan di:
- Components
- Pages
- Styles
- Config files

### 2. TypeScript

Gunakan TypeScript untuk type safety:

```typescript
// Import types
import type { Recipient } from '@/lib/types';

// Use types
const recipient: Recipient = { ... };
```

### 3. Tailwind CSS

Gunakan Tailwind classes untuk styling:

```tsx
<div className="p-4 bg-green-600 text-white rounded-lg">
  Content
</div>
```

### 4. API Calls

Gunakan API client dari `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Call API
const envelope = await api.getEnvelope(id);
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

### TypeScript Errors

```bash
# Check TypeScript
pnpm tsc --noEmit

# If errors persist, restart TS server in VSCode
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Tailwind Not Working

```bash
# Ensure Tailwind is configured
# Check tailwind.config.ts and postcss.config.mjs

# Restart dev server
pnpm dev
```

### API Connection Failed

1. Check backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS settings di backend
4. Check network tab di browser DevTools

---

## 📦 Adding New Dependencies

### Install Package

```bash
# Production dependency
pnpm add package-name

# Dev dependency
pnpm add -D package-name
```

### Common Packages

```bash
# UI Libraries
pnpm add framer-motion
pnpm add @radix-ui/react-dialog

# Utilities
pnpm add date-fns
pnpm add lodash

# Forms
pnpm add react-hook-form zod
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Set root directory to `frontend`
   - Add environment variables
   - Deploy

3. **Environment Variables di Vercel**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### Manual Build

```bash
# Build
pnpm build

# Test production build locally
pnpm start

# Deploy .next folder to hosting
```

---

## 🔐 Environment Variables Reference

### Development

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Production

```env
NEXT_PUBLIC_API_URL=https://api.bagiberkah.com/api
NEXT_PUBLIC_APP_URL=https://bagiberkah.com
NODE_ENV=production
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

---

## 🆘 Need Help?

1. Check documentation di `README.md`
2. Check structure di `STRUCTURE.md`
3. Check browser console untuk errors
4. Check terminal untuk build errors
5. Check backend logs

---

## ✅ Checklist Setup

- [ ] Node.js v18+ installed
- [ ] pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] `.env.local` created and configured
- [ ] Backend running
- [ ] Dev server running (`pnpm dev`)
- [ ] Browser opened at `http://localhost:3000`
- [ ] No errors in console
- [ ] API connection working

Jika semua checklist ✅, setup berhasil! 🎉
