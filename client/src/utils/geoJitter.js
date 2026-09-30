// Simple deterministic string hash (32-bit FNV-1a) — not cryptographic, just
// needs to be stable across builds so jitter doesn't shift between deploys.
function hashString(str) {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

// Deterministic value in [-1, 1] for a given seed string.
function seededUnit(seed) {
  return (hashString(seed) % 2000) / 1000 - 1
}

// ~500-650m at UK latitudes — enough to separate pins stacked in the same
// town without moving them out of it. Purely cosmetic, not a privacy measure:
// coords are already only as precise as the town centroid they come from.
const JITTER_DEGREES = 0.006

export function jitterCoordinate({ lat, lng }, slug) {
  return {
    lat: lat + seededUnit(`${slug}:lat`) * JITTER_DEGREES,
    lng: lng + seededUnit(`${slug}:lng`) * JITTER_DEGREES
  }
}
