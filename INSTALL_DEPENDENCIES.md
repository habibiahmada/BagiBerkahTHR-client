# Install Dependencies - BagiBerkah Frontend

Panduan lengkap untuk instalasi semua dependencies yang diperlukan.

## 📦 Dependencies Overview

Frontend BagiBerkah menggunakan dependencies berikut:

### Production Dependencies
- `next` - Framework React
- `react` & `react-dom` - UI library
- `clsx` & `tailwind-merge` - Utility untuk Tailwind classes
- `recharts` - Library untuk charts
- `qrcode.react` - Generate QR code
- `html5-qrcode` - Scan QR code
- `react-hook-form` - Form management
- `zod` - Schema validation

### Development Dependencies
- `typescript` - Type checking
- `@types/*` - Type definitions
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `eslint-config-next` - ESLint config untuk Next.js

---

## 🚀 Installation Methods

### Method 1: Using pnpm (Recommended)

```bash
cd frontend

# Install all dependencies
pnpm install

# Or install specific packages
pnpm add clsx tailwind-merge
pnpm add recharts
pnpm add qrcode.react
pnpm add html5-qrcode
pnpm add react-hook-form zod
```

### Method 2: Using npm

```bash
cd frontend

# Install all dependencies
npm install

# Or install specific packages
npm install clsx tailwind-merge
npm install recharts
npm install qrcode.react
npm install html5-qrcode
npm install react-hook-form zod
```

### Method 3: Using yarn

```bash
cd frontend

# Install all dependencies
yarn install

# Or install specific packages
yarn add clsx tailwind-merge
yarn add recharts
yarn add qrcode.react
yarn add html5-qrcode
yarn add react-hook-form zod
```

---

## 📋 Step-by-Step Installation

### 1. Install Core Dependencies

```bash
# Already included in package.json
pnpm install
```

### 2. Install Additional UI Libraries (Optional)

```bash
# Framer Motion for animations
pnpm add framer-motion

# Radix UI for advanced components
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-toast

# Lucide React for icons
pnpm add lucide-react
```

### 3. Install Form & Validation

```bash
# Already in package.json
# react-hook-form + zod
pnpm add react-hook-form zod
pnpm add @hookform/resolvers
```

### 4. Install Chart Libraries

```bash
# Already in package.json
# Recharts for data visualization
pnpm add recharts
```

### 5. Install QR Code Libraries

```bash
# Already in package.json
# QR generation and scanning
pnpm add qrcode.react
pnpm add html5-qrcode
pnpm add -D @types/qrcode.react
```

### 6. Install Utility Libraries

```bash
# Already in package.json
# Class name utilities
pnpm add clsx tailwind-merge

# Date utilities (optional)
pnpm add date-fns

# Copy to clipboard (optional)
pnpm add copy-to-clipboard
```

---

## 🔍 Verify Installation

### Check Installed Packages

```bash
# List all dependencies
pnpm list

# Check specific package
pnpm list recharts
pnpm list qrcode.react
```

### Check for Vulnerabilities

```bash
# Audit dependencies
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

### Check for Updates

```bash
# Check outdated packages
pnpm outdated

# Update packages
pnpm update
```

---

## 🐛 Troubleshooting

### Issue: Package Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: Version Conflicts

```bash
# Check for conflicts
pnpm why package-name

# Force install specific version
pnpm add package-name@version
```

### Issue: Peer Dependencies Warning

```bash
# Install peer dependencies
pnpm install --legacy-peer-deps

# Or ignore peer dependencies
pnpm install --no-peer-deps
```

### Issue: TypeScript Errors

```bash
# Install missing type definitions
pnpm add -D @types/node
pnpm add -D @types/react
pnpm add -D @types/react-dom
```

---

## 📦 Complete Package.json

Berikut adalah `package.json` lengkap dengan semua dependencies:

```json
{
  "name": "bagiberkah-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "recharts": "^2.15.0",
    "qrcode.react": "^4.1.0",
    "html5-qrcode": "^2.3.8",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 🔄 Update Dependencies

### Update All Packages

```bash
# Check for updates
pnpm outdated

# Update all to latest
pnpm update --latest

# Or update specific package
pnpm update next --latest
```

### Update Next.js

```bash
# Update Next.js to latest
pnpm add next@latest react@latest react-dom@latest
```

### Update Tailwind CSS

```bash
# Update Tailwind
pnpm add -D tailwindcss@latest
```

---

## 📝 Optional Dependencies

### For Enhanced Features

```bash
# Animation library
pnpm add framer-motion

# Advanced UI components
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu

# Icons
pnpm add lucide-react

# Date utilities
pnpm add date-fns

# State management (if needed)
pnpm add zustand

# API client (alternative)
pnpm add axios
pnpm add @tanstack/react-query
```

### For Development

```bash
# Prettier for code formatting
pnpm add -D prettier
pnpm add -D eslint-config-prettier

# Testing libraries
pnpm add -D jest
pnpm add -D @testing-library/react
pnpm add -D @testing-library/jest-dom

# Storybook for component development
pnpm add -D @storybook/react
```

---

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed globally
- [ ] Navigated to frontend directory
- [ ] Ran `pnpm install`
- [ ] No errors during installation
- [ ] All dependencies installed successfully
- [ ] `node_modules` folder created
- [ ] `pnpm-lock.yaml` generated
- [ ] Can run `pnpm dev` successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## 🚀 Post-Installation

### 1. Verify Installation

```bash
# Run dev server
pnpm dev

# Should start without errors
# Open http://localhost:3000
```

### 2. Check TypeScript

```bash
# Type check
pnpm tsc --noEmit

# Should show no errors
```

### 3. Check Linting

```bash
# Run linter
pnpm lint

# Should pass without errors
```

### 4. Test Build

```bash
# Build for production
pnpm build

# Should build successfully
```

---

## 📚 Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

---

## 🆘 Need Help?

If you encounter issues:

1. Check error messages carefully
2. Search for the error on Google/Stack Overflow
3. Check package documentation
4. Clear cache and reinstall
5. Check Node.js version compatibility
6. Ask for help in project chat/issues

---

**Last Updated**: March 2026
