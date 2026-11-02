import Hero from '../components/Hero'
import Capabilities from '../components/Capabilities'
import Work from '../components/Work'
import CoverageMap from '../components/CoverageMap'
import DividerBand from '../components/DividerBand'
import TrackRecord from '../components/TrackRecord'
import Process from '../components/Process'
import Testimonial from '../components/Testimonial'
import QuoteCTA from '../components/QuoteCTA'
import { useSiteData } from '../SiteData'

export default function Home() {
  const { projects } = useSiteData()
  const mappable = projects.filter((p) => p.coords)

  return (
    <>
      <Hero />
      <Capabilities />
      {projects.length > 0 && <Work />}
      {mappable.length > 0 && <CoverageMap />}
      <DividerBand />
      <TrackRecord />
      <Process />
      <Testimonial />
      <QuoteCTA />
    </>
  )
}
