# KMUTNB Broadcast Studio

An animated lower-third system for OBS Studio. The control dashboard, transparent overlay, API, and Socket.IO server all run on one port.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Start

```bash
npm install
npm run dev
```

Open [the control dashboard](http://localhost:3000/control) and [the overlay](http://localhost:3000/overlay). `npm run dev` starts Express, Vite, and Socket.IO together. The first run creates `data/config.json` with three profiles marked **DEMO**. Speaker data and settings are saved there and restored after restart. The on-air state is intentionally reset at startup; it starts hidden unless **Auto-show on startup** is enabled.

For a production build:

```bash
npm run build
NODE_ENV=production npm start
```

Copy `.env.example` to `.env` to change `PORT`, `HOST`, or `DATA_FILE`. The default port is **3000**.

## Deployment (frontend and backend on separate hosts)

This app is one Express + Socket.IO process serving both the UI and the API locally. A static host like Vercel cannot run that process, so it can only serve the built frontend — the backend needs an always-on Node host (Render, Railway, Fly.io, a VPS, etc.) running `npm run build && NODE_ENV=production npm start`.

1. Deploy `server/index.ts` to an always-on Node host with a persistent disk for `DATA_FILE`. Set `CORS_ORIGIN` to the frontend's origin(s) and `CONTROL_TOKEN` to a long random secret — see `.env.example` for details. Leaving `CONTROL_TOKEN` unset leaves mutation endpoints and commands unauthenticated; do not do this on a publicly reachable deployment.
2. Deploy the frontend (`npm run build`'s `dist/`) to a static host. Set `VITE_API_URL` to the backend's public `https://` URL at build time.
3. On the live control page, open **Settings** and paste the `CONTROL_TOKEN` value once — it's stored in this browser only and sent with every cue and edit. The overlay page needs no token; it only ever receives `snapshot` broadcasts.

## OBS setup

1. Add a **Browser Source** to your OBS scene.
2. Set its URL to `http://localhost:3000/overlay`.
3. Set width to **1920** and height to **1080**.
4. Leave OBS running and open `http://localhost:3000/control` in a browser.
5. Select a speaker and click **Show CG**. Use **Hide CG**, **Next speaker**, or **Replay animation** during the program.

The overlay has a transparent page background, no controls, and no scrolling. Multiple Browser Sources receive the same live state. If the connection drops, Socket.IO reconnects and the server sends the current state. Disable Browser Source shutdown when hidden if you want transitions to remain ready while changing scenes.

## Designs and controls

The design picker includes Classic, Angular, Overlay, and Rounded. All four use the shared SVG renderer in `src/components/LowerThird.tsx` with editable speaker text. Classic uses `public/assets/Classic_1.svg`; the other designs use the KMUTNB seal in `public/assets/kmutnb-seal.png`. They share speaker data, animation settings, and live commands. Selecting a design or editing an active speaker updates connected overlays without refreshing OBS.

Speaker fields are name, academic title, position, and department/faculty. Thai and English input are supported. Long names shrink to fit the name panel, and long titles wrap within the bar. The initial demo names are fictional examples, not claims about KMUTNB staff.

The control dashboard uses a text-based KMUTNB identifier. The first four lower thirds display the seal region from the image provided with this project.

## API and project structure

- `GET /api/state` — saved data plus current on-air state
- `POST /api/speakers` — add a speaker
- `PUT /api/speakers/:id` — edit a speaker
- `DELETE /api/speakers/:id` — remove a speaker
- `PATCH /api/settings` — update design, speed, or startup behavior
- Socket.IO `snapshot` event — authoritative synchronized state
- Socket.IO `command` event — `select`, `show`, `hide`, `next`, or `replay`

`server/` holds the API, WebSocket commands, and JSON store. `src/Control.tsx` coordinates the operator dashboard; the preview, controls, settings, designs, speaker list, and editor live in `src/components/`. `src/Overlay.tsx` renders the shared overlay and animation timeline. `src/components/LowerThird.tsx` contains the four SVG designs, and `shared/types.ts` holds the data contract and demo profiles.

## Checks

```bash
npm test
npm run build
```

The tests cover input validation, speaker sequencing, and persistence. For a full visual check, open the control dashboard, show each design, and confirm the Browser Source canvas is transparent outside the lower third.
