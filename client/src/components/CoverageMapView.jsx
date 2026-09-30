import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapLibreMap, NavigationControl, Popup, addProtocol, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { Protocol } from 'pmtiles'
import { namedFlavor, layers } from '@protomaps/basemaps'
import { site } from '../siteConfig'
import { buildWorkFeatureCollection } from '../utils/workGeoJson'
import { getMapThemeOverrides } from '../utils/mapTheme'

// MapLibre v6 can't reliably resolve its own worker URL inside a bundler's
// module graph, so it must be wired up explicitly — see
// https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/
setWorkerUrl(maplibreWorkerUrl)

// The pmtiles:// protocol must be registered once, globally, before any map
// using it is created.
const protocol = new Protocol()
addProtocol('pmtiles', protocol.tile)

const CLUSTER_MAX_ZOOM = 12

export default function CoverageMapView() {
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const origin = window.location.origin
    const flavor = { ...namedFlavor('light'), ...getMapThemeOverrides() }

    const style = {
      version: 8,
      glyphs: `${origin}/fonts/{fontstack}/{range}.pbf`,
      sprite: `${origin}/sprites/v4/light`,
      sources: {
        protomaps: {
          type: 'vector',
          url: `pmtiles://${origin}/tiles/thames-valley.pmtiles`,
          attribution: '© <a href="https://openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        },
        work: {
          type: 'geojson',
          data: buildWorkFeatureCollection(site.work),
          cluster: true,
          clusterMaxZoom: CLUSTER_MAX_ZOOM,
          clusterRadius: 50
        }
      },
      layers: [
        ...layers('protomaps', flavor, { lang: 'en' }),
        {
          id: 'clusters',
          type: 'circle',
          source: 'work',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': flavor.major,
            'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        },
        {
          id: 'cluster-count',
          type: 'symbol',
          source: 'work',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Noto Sans Regular'],
            'text-size': 13
          },
          paint: {
            'text-color': '#ffffff'
          }
        },
        {
          id: 'unclustered-point',
          type: 'circle',
          source: 'work',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': flavor.highway,
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        }
      ]
    }

    const map = new MapLibreMap({
      container,
      style,
      center: [-0.9, 51.5],
      zoom: 9,
      attributionControl: true
    })

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')

    let popup = null

    const handleClusterClick = async (e) => {
      const [feature] = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
      if (!feature) return
      const clusterId = feature.properties.cluster_id
      try {
        // getClusterExpansionZoom returns a Promise (since MapLibre v4) — not a callback.
        const zoom = await map.getSource('work').getClusterExpansionZoom(clusterId)
        map.easeTo({ center: feature.geometry.coordinates, zoom })
      } catch {
        // Ignore — nothing sensible to do if the source can't report an expansion zoom.
      }
    }

    const handlePointClick = (e) => {
      const feature = e.features?.[0]
      if (!feature) return
      navigate(`/work/${feature.properties.slug}`)
    }

    const handlePointEnter = (e) => {
      map.getCanvas().style.cursor = 'pointer'
      const feature = e.features?.[0]
      if (!feature) return

      popup = new Popup({ closeButton: false, closeOnClick: false })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<strong>${feature.properties.title}</strong><br />${feature.properties.county}`
        )
        .addTo(map)
    }

    const handlePointLeave = () => {
      map.getCanvas().style.cursor = ''
      popup?.remove()
      popup = null
    }

    const handleClusterEnter = () => {
      map.getCanvas().style.cursor = 'pointer'
    }

    const handleClusterLeave = () => {
      map.getCanvas().style.cursor = ''
    }

    map.on('click', 'clusters', handleClusterClick)
    map.on('click', 'unclustered-point', handlePointClick)
    map.on('mouseenter', 'unclustered-point', handlePointEnter)
    map.on('mouseleave', 'unclustered-point', handlePointLeave)
    map.on('mouseenter', 'clusters', handleClusterEnter)
    map.on('mouseleave', 'clusters', handleClusterLeave)

    return () => {
      popup?.remove()
      map.remove()
    }
  }, [navigate])

  return (
    <div
      className="coverage-map"
      ref={containerRef}
      role="img"
      aria-label={`Map of recent projects across ${site.company.areasCovered}`}
    />
  )
}
