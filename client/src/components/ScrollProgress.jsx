import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let frame = null

    const update = () => {
      frame = null
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0
      if (barRef.current) {
        barRef.current.style.width = `${progress}%`
      }
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" ref={barRef} />
    </div>
  )
}
