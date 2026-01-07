# Racket Connect

A social app for finding padel buddies and organizing matches.

## Project Structure

```
racket-connect/
├── mobile/          # Flutter mobile app (not part of MVP - ignored)
├── web/             # React web app (main application)
└── README.md
```

## Web App (React) - Main Application

The web app is the main application for this MVP demo. It's built with React, TypeScript, Vite, and Tailwind CSS.

### Setup

See `web/README.md` for detailed setup instructions.

### Quick Start

```bash
cd web
npm install
npm run dev
```

### Deployment

The web app is configured for deployment on Railway. See `web/DEPLOYMENT.md` for deployment instructions.

## Mobile App (Flutter)

The mobile app is not part of the MVP and is currently ignored. It may be developed in the future.

## Features

- Create padel matches with location and time
- View all available matches
- Join/leave matches
- See match participants
- Dummy authentication (for demo)

## Tech Stack

### Web App (Main)
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **date-fns** - Date formatting
- **lucide-react** - Icons

### Mobile (Future)
- **Flutter** - Cross-platform mobile framework
- **Riverpod** - State management
- **Material Design 3** - UI components
- *Not part of MVP - development paused*
