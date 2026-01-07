# Railway Deployment Guide

This document outlines the deployment configuration for the Racket Connect web app on Railway.

## Configuration Files

### 1. `railway.json`
- Defines the build and deployment configuration
- Uses Nixpacks builder
- Build command: `npm run build`
- Start command: `npm run start`

### 2. `nixpacks.toml`
- Alternative configuration for Nixpacks
- Explicitly defines Node.js 18
- Sets up build and start phases

### 3. `package.json`
- **Build script**: `npm run build` - Compiles TypeScript and builds with Vite
- **Start script**: `npm run start` - Serves the built `dist` folder using `serve`
- **Dependencies**: Includes `serve` package for production static file serving

### 4. `vite.config.ts`
- Optimized for production builds
- Code splitting with manual chunks for React and UI vendors
- ESBuild minification
- Output directory: `dist`

## Deployment Steps

1. **Connect Repository to Railway:**
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Select the `web` folder as the root directory (if deploying from monorepo)

2. **Railway Auto-Detection:**
   - Railway will detect the `railway.json` or `nixpacks.toml` configuration
   - It will automatically:
     - Install dependencies (`npm ci`)
     - Run the build command (`npm run build`)
     - Start the server (`npm run start`)

3. **Environment Variables:**
   - No environment variables required for MVP
   - `PORT` is automatically set by Railway

4. **Verify Deployment:**
   - Railway will provide a URL after deployment
   - The app should be accessible at that URL

## Build Output

The build process creates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized JavaScript and CSS bundles
  - `react-vendor-*.js` - React, React DOM, React Router
  - `ui-vendor-*.js` - Lucide React icons
  - `index-*.js` - Application code
  - `index-*.css` - Tailwind CSS styles

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Port issues**: Railway automatically sets `PORT`, ensure `serve` uses `$PORT`
- **Static files not loading**: Verify `dist` folder is created and contains files
- **Routing issues**: Ensure `serve -s` flag is used for SPA routing support

## Notes

- The app uses in-memory storage (no database required for MVP)
- All authentication is dummy/mock for demo purposes
- No external services or APIs needed

