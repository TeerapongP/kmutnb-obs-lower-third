export const classicArtwork = { width: 1551, height: 190 } as const;

export const classicSweep = {
  x: 0,
  y: 0,
  width: 220,
  height: classicArtwork.height,
  startX: -420,
  skewDegrees: -18,
} as const;

export function classicSweepBounds(offsetX: number) {
  const skew = Math.tan((classicSweep.skewDegrees * Math.PI) / 180);
  const top = classicSweep.y * skew;
  const bottom = (classicSweep.y + classicSweep.height) * skew;
  const left = offsetX + classicSweep.x + Math.min(top, bottom);
  const right = offsetX + classicSweep.x + classicSweep.width + Math.max(top, bottom);
  return { left, right };
}

const startBounds = classicSweepBounds(classicSweep.startX);
const beamWidth = startBounds.right - startBounds.left;
const travel = Math.ceil(classicArtwork.width + beamWidth - startBounds.right);

export const classicSweepTarget = {
  endX: classicSweep.startX + travel,
  travel,
} as const;
