// Reads the site's existing CSS custom properties so the map recolor stays
// in sync with global.css instead of duplicating hex literals here.
function token(name) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// A targeted subset of @protomaps/basemaps' Flavor keys, overriding only the
// ones with real visual weight — everything else falls back to the LIGHT
// flavor's defaults. Font keys (`regular`/`bold`/`italic`) are deliberately
// left untouched so they keep resolving against the self-hosted glyph set.
export function getMapThemeOverrides() {
  const mist = token('--mist')
  const ink = token('--ink')
  const mid = token('--mid')
  const sky = token('--sky')
  const skyBright = token('--sky-bright')
  const hairline = token('--hairline-light')

  return {
    background: mist,
    earth: '#ffffff',
    water: mist,
    buildings: hairline,
    boundaries: mid,

    major_casing_early: hairline,
    major_casing_late: hairline,
    major: sky,
    highway_casing_early: hairline,
    highway_casing_late: hairline,
    highway: skyBright,
    minor_a: hairline,
    minor_b: hairline,

    city_label: ink,
    city_label_halo: '#ffffff',
    subplace_label: mid,
    subplace_label_halo: '#ffffff',
    roads_label_major: ink,
    roads_label_major_halo: '#ffffff',
    address_label: mid,
    address_label_halo: '#ffffff'
  }
}
