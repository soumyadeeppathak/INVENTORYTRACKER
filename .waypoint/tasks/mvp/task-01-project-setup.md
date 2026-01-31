# Task 01: Project Setup

**Phase**: 1 - Foundation
**Priority**: Critical
**Blocked By**: None
**Blocks**: All subsequent tasks

---

## Objective

Initialize the Next.js 15 project with TypeScript, Tailwind CSS, and PWA support.

## Acceptance Criteria

- [ ] Next.js 15 project created with App Router
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS installed and configured
- [ ] Biome configured for linting and formatting
- [ ] PWA manifest.json created with app metadata
- [ ] Service worker configuration (Serwist/next-pwa)
- [ ] App icons created (192x192, 512x512, maskable)
- [ ] Environment variables template (.env.example)
- [ ] Project runs locally with `npm run dev`
- [ ] All quality commands work: `npm run lint`, `npm run format`, `npm run typecheck`

## Technical Details

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  }
}
```

### PWA Manifest

```json
{
  "name": "InventoryTracker",
  "short_name": "Inventory",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAFA",
  "theme_color": "#6366F1",
  "icons": [...]
}
```

### Environment Variables

```
DATABASE_URL=
RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Files to Create

- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `biome.json`
- `next.config.js` (with PWA config)
- `public/manifest.json`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/icon-maskable.png`
- `.env.example`
- `.gitignore`
- `src/app/layout.tsx` (root layout with PWA meta tags)
- `src/app/page.tsx` (placeholder home)
- `src/styles/globals.css`

## Verification

```bash
npm run dev        # App starts on localhost:3000
npm run lint       # No errors
npm run format     # Formats successfully
npm run typecheck  # No type errors
npm run build      # Builds successfully with PWA assets
```

---

_Task 01 of 20 | Phase 1: Foundation_
