// Town-level lookup via postcodes.io (free, UK-only, no API key).
// Only the town name and county are ever sent — never a street or postcode.

// Matches the bounding box of client/public/tiles/thames-valley.pmtiles, so we
// prefer the "Wargrave" near Reading over one in the North West.
const BBOX = { minLng: -1.75, minLat: 50.7, maxLng: -0.3, maxLat: 52.05 }

const TYPE_RANK = { City: 0, Town: 1, Village: 2, Hamlet: 3, 'Suburban Area': 4 }

function inBox(r) {
  return (
    r.longitude >= BBOX.minLng &&
    r.longitude <= BBOX.maxLng &&
    r.latitude >= BBOX.minLat &&
    r.latitude <= BBOX.maxLat
  )
}

function mentions(r, county) {
  if (!county || county === 'Other') return false
  const hay = [r.county_unitary, r.district_borough, r.region, r.name_2].filter(Boolean).join(' ').toLowerCase()
  return hay.includes(county.toLowerCase())
}

export async function geocodeTown(town, county) {
  if (!town) return null
  const url = `https://api.postcodes.io/places?q=${encodeURIComponent(town)}&limit=20`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const body = await res.json()
    const wanted = town.trim().toLowerCase()
    const candidates = (body.result || []).filter(
      (r) => typeof r.latitude === 'number' && typeof r.longitude === 'number'
    )
    if (candidates.length === 0) return null

    const score = (r) =>
      (r.name_1?.toLowerCase() === wanted ? 0 : 100) +
      (inBox(r) ? 0 : 50) +
      (mentions(r, county) ? 0 : 10) +
      (TYPE_RANK[r.local_type] ?? 5)

    const best = [...candidates].sort((a, b) => score(a) - score(b))[0]
    const area = best.county_unitary || best.district_borough || best.region || ''
    return {
      lat: Number(best.latitude.toFixed(4)),
      lng: Number(best.longitude.toFixed(4)),
      label: [best.name_1, area].filter(Boolean).join(', ')
    }
  } catch (err) {
    console.warn('Town lookup failed:', err.message)
    return null
  }
}
