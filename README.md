# SpeedReader

A free, web-based speed reading app using RSVP (Rapid Serial Visual Presentation) technology.

## Features

- **RSVP Reader** with Optimal Recognition Point (ORP) highlighting
- **Adjustable Speed**: 100 - 1000 WPM with preset levels
- **Multiple Input Methods**:
  - Paste text directly
  - Extract articles from URLs
  - Upload PDF, EPUB, or TXT files
- **Dark/Light Theme** with system preference detection
- **Keyboard Shortcuts** for hands-free reading
- **Progress Tracking** with word count and percentage

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Previous word |
| `→` | Next word |
| `↑` | Increase speed |
| `↓` | Decrease speed |
| `R` | Restart |

## Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Parsing**: PDF.js
- **EPUB Parsing**: EPub.js

## License

MIT
