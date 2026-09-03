'use client'

import { useEffect, useRef, useState } from 'react'

const CV_WIDTH = 794

// Centers an A4-width CV and scales it down to fit narrow containers (mobile).
// Print CSS resets .cv-scale-wrapper and .cv-scale-inner so printing stays 1:1.
export default function ScaledCV({ children, maxScale = 0.85 }: { children: React.ReactNode; maxScale?: number }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(maxScale)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const update = () => {
      const w = outerRef.current?.clientWidth ?? CV_WIDTH
      const s = Math.min(maxScale, Math.max(0.3, (w - 8) / CV_WIDTH))
      setScale(s)
      const docH = innerRef.current?.offsetHeight ?? 1123
      setHeight(docH * s)
    }
    update()
    const ro = new ResizeObserver(update)
    if (outerRef.current) ro.observe(outerRef.current)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [maxScale])

  return (
    <div ref={outerRef} className="cv-scale-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height, overflow: 'visible' }}>
      <div ref={innerRef} className="cv-scale-inner" style={{ transform: `scale(${scale})`, transformOrigin: 'top center', flexShrink: 0 }}>
        {children}
      </div>
    </div>
  )
}
