import Hero from '../components/Hero'
import Capabilities from '../components/Capabilities'
import Work from '../components/Work'
import CoverageMap from '../components/CoverageMap'
import DividerBand from '../components/DividerBand'
import TrackRecord from '../components/TrackRecord'
import Process from '../components/Process'
import Testimonial from '../components/Testimonial'
import QuoteCTA from '../components/QuoteCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Work />
      <CoverageMap />
      <DividerBand />
      <TrackRecord />
      <Process />
      <Testimonial />
      <QuoteCTA />
    </>
  )
}
