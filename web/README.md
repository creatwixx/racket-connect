# Racket Connect - Web App

React web application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Vite** - Fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **date-fns** - Date formatting
- **lucide-react** - Icons

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Install shadcn/ui components** (as needed):
   ```bash
   bunx shadcn-ui@latest add button
   bunx shadcn-ui@latest add card
   # etc.
   ```

3. **Run development server:**
   ```bash
   bun run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   # or
   bun run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   # or
   bun run preview
   ```

## Deployment to Railway

This app is configured for deployment on Railway.

### Quick Deploy

1. **Connect your repository to Railway:**
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Railway will auto-detect the Vite configuration

2. **Deploy:**
   - Railway will automatically:
     - Install dependencies (`npm ci`)
     - Build the app (`npm run build`)
     - Start the server (`npm run start`)

3. **Environment Variables:**
   - No environment variables are required for this MVP demo
   - The app uses in-memory storage for matches

### Manual Configuration

If needed, you can manually configure:
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Root Directory:** `web` (if deploying from monorepo root)

The app will be available at the Railway-provided URL.

## Design Breakpoints

The app is built **mobile-first** with 3 main breakpoints:

- **Mobile (default)**: `< 640px` - Base styles, mobile-first approach
- **Tablet**: `≥ 768px` (md) - Tablet layouts
- **Desktop (1440p)**: `≥ 1440px` (xl) - Large desktop layouts

All styles start mobile-first, then enhance for larger screens using Tailwind's responsive prefixes (`md:`, `xl:`).

## Project Structure

```
web/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utilities
│   ├── stores/        # Zustand stores
│   ├── types/         # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

## Features

Same features as mobile app:
- Create padel matches
- View matches list
- Join/leave matches
- Match detail screen with participants
- Dummy authentication
