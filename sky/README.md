# SkyRoute – Booking Flights from Kabul

React + Vite + Framer Motion + React Router. Fully responsive (phone, tablet, desktop).

## Run
```
npm install
npm run dev
```

## Build
```
npm run build
npm run preview
```

## Deploy (Vercel)
Import the GitHub repo in Vercel. It detects Vite automatically. `vercel.json` keeps page refresh working on sub-pages.

## Videos
All videos are in `public/videos`.
- Home hero: `hero-p.mp4` (portrait, phones/tablets) and `hero-l.mp4` (landscape, desktop), with `.jpg` posters. Replace these files to change the hero.
- Other sections: `skyN-p.mp4` (720x1280) and `skyN-l.mp4` (1920x1080).
- `VBg` in `src/ui.jsx` picks the right file, pauses off-screen videos and respects "reduce motion".

## Project documents
Open `public/docs/index.html` (or `/docs/index.html` when running).
