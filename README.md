# KMUTNB Lower Third Studio

A frontend-only lower-third designer and preview. Speaker profiles, designs, and animation settings are saved in the current browser using `localStorage`.

## Start

Use the existing project dependencies and scripts:

```bash
npm run dev
```

Open the local URL printed by Vite. The app starts with three example speaker profiles when this browser has no saved studio data. Use **Add speaker**, **Show CG**, **Hide CG**, and the design controls to work with the local preview.

Build the static frontend with:

```bash
npm run build
```

The generated `dist/` directory can be hosted as a static site. `npm run preview` serves that build locally.

## Data and scope

Speaker profiles and studio settings stay in the current browser. **Copy OBS link** creates one stable transparent `/overlay` Browser Source URL. The dashboard publishes speaker, design, visibility, and animation changes to a private Vercel Blob record; the OBS page checks for updates once per second. The link is a bearer URL, so anyone who has it can view the current on-air graphic.

The design picker includes Classic, Tilted, Overlay, and Rounded. The first four designs use the SVG renderer in `src/components/LowerThird.tsx`; `public/assets/Classic_1.svg` supplies the Classic artwork, and the other designs use `public/assets/kmutnb-seal.png`. The additional Premium and Speaker styles remain available in the local preview.

Speaker fields are name, academic title, position, and department/faculty. Thai and English input are supported. Long names shrink to fit the name panel, and long titles wrap within the bar. The initial example names are fictional.

`src/Control.tsx` composes the workspace. `src/studio.tsx` owns browser persistence and local studio actions. The preview, controls, settings, design library, speaker list, and editor live in `src/components/`. `src/Overlay.tsx` contains the graphic renderer used by the in-app preview. `shared/types.ts` defines the frontend data model and example profiles.

## Checks

```bash
npm test
npm run build
npm run format:check
```
