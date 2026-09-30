import { jitterCoordinate } from './geoJitter'

export function buildWorkFeatureCollection(work) {
  return {
    type: 'FeatureCollection',
    features: work.map((project) => {
      const { lat, lng } = jitterCoordinate(project.coords, project.slug)
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          slug: project.slug,
          title: project.title,
          county: project.county,
          location: project.location
        }
      }
    })
  }
}
