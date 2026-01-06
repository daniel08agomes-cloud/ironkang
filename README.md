# IRONKANG - Elite Workout Tracker

A Progressive Web App (PWA) for tracking workout progressions, built with vanilla JavaScript.

## Features

- 📱 Progressive Web App - works offline, installable
- 🏋️ Multiple workout programs (Daniel & Beatriz)
- 📊 Exercise progression tracking
- 📅 Workout history and calendar
- 💪 PR (Personal Record) tracking
- 📤 Export/Import data backup
- ⏱️ Rest timer with audio feedback
- 🎥 Exercise form videos

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development Server

Run the development server with hot module replacement:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
ironkang/
├── index.html           # Main HTML file with embedded JS/CSS
├── public/              # Static assets
│   ├── gifs/           # Exercise demonstration videos
│   ├── icon-192.png    # PWA icon (192x192)
│   ├── icon-512.png    # PWA icon (512x512)
│   ├── manifest.json   # PWA manifest
│   └── sw.js          # Service worker
├── dist/               # Production build output (generated)
├── package.json        # Dependencies and scripts
├── vite.config.js     # Vite build configuration
└── .gitignore         # Git ignore rules

```

## Build System

This project uses [Vite](https://vitejs.dev/) for development and building:

- **Fast development** with Hot Module Replacement (HMR)
- **Optimized builds** with esbuild minification
- **Asset optimization** automatically handles static files
- **Gzip compression** reduces bundle size by ~79% (90KB → 19KB)

### Build Optimizations

The production build includes:
- HTML/CSS/JS minification
- Asset optimization
- Lazy loading for videos (`preload="none"`)
- Efficient caching strategy via service worker

## Performance

- **Initial load:** ~19 KB (gzipped HTML/CSS/JS)
- **Videos:** ~18 MB (lazy loaded on demand)
- **Total size:** ~17 MB (production build)
- **Offline capable:** Full functionality after first load

## Data Storage

All workout data is stored locally using:
- `localStorage` for core progression data
- `sessionStorage` for temporary workout state
- JSON export/import for backups

## Browser Support

Works on all modern browsers with PWA support:
- Chrome/Edge (recommended)
- Firefox
- Safari (iOS/macOS)

## Deployment

The production build can be deployed to any static hosting:

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

Recommended hosts:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

### GitHub Pages Deployment

1. Build the project: `npm run build`
2. Push the `dist/` folder to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## License

ISC
