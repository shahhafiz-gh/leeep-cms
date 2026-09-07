'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import type { SchoolData } from '@/types/school.types'
import { isSectionVisible } from '@/shared/section-visibility'

/**
 * The reference site's "fact counter" strip: the school name over four figures
 * that count up when the strip scrolls into view.
 *
 * The count is a pure enhancement. The real figure is what renders on the
 * server, before hydration, and whenever the animation is skipped — so a
 * visitor whose observer never fires reads "5000+", never "0+". A strip of
 * zeroes is a far worse failure than a strip that simply does not animate.
 *
 * It therefore animates only when the strip STARTS off-screen and later scrolls
 * into view. A strip already in view at mount is left at its final value rather
 * than being knocked back to zero to count up in front of the reader.
 */
/**
 * Only one transition matters: idle -> animating. "Skipped" needs no state of
 * its own, because a skipped counter renders exactly what an un-started one
 * does — the authored figure.
 */
type Phase = 'idle' | 'animating'

export default function StatsCounter({ data }: { data: SchoolData }) {
  const stats = data.stats ?? []
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    // Already on screen at mount → leave the final figures alone rather than
    // rewinding them to zero to count up in front of the reader.
    const box = node.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('animating')
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!stats.length || !isSectionVisible(data, 'stats')) return null

  return (
    <section ref={ref} className="bg-white py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-th-heading md:text-3xl">{data.name}</h2>
        <span className="mx-auto mt-4 block h-[3px] w-14 bg-th-primary" />

        <div className="mt-11 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={`${stat.label}-${i}`} className="px-3">
              {stat.icon && <Icon icon={stat.icon} className="mx-auto mb-3 h-9 w-9 text-th-primary" />}
              <div
                data-edit={`stats.${i}.value`}
                className="text-4xl font-bold leading-none text-th-primary md:text-5xl"
              >
                <CountUp value={stat.value} suffix={stat.suffix} phase={phase} />
              </div>
              <div
                data-edit={`stats.${i}.label`}
                className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-th-heading"
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Splits "1000+" into 1000 and "+", counts the number, keeps the suffix.
 *
 * `value` is `string | number` in the schema and a separate `suffix` field also
 * exists, so both are honoured: an inline suffix on the value and the explicit
 * field are concatenated rather than one silently winning. A value that is not
 * numeric at all ("A+", "Top 10") is printed verbatim and never animated.
 */
function CountUp({
  value,
  suffix,
  phase,
}: {
  value: string | number
  suffix?: string
  phase: Phase
}) {
  const raw = String(value ?? '').trim()
  const match = /^(\d[\d,]*)(.*)$/.exec(raw)
  // Kept exactly as the school typed it — grouping is theirs to choose, so
  // "5000" must not come back as "5,000".
  const authored = match ? match[1] : ''
  const target = match ? Number(match[1].replace(/,/g, '')) : NaN
  const tail = `${match ? match[2] : ''}${suffix ?? ''}`
  const [shown, setShown] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'animating' || !Number.isFinite(target)) return
    const duration = 1400
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic, so the number decelerates into its final value
      setShown(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, target])

  if (!Number.isFinite(target)) return <>{`${raw}${suffix ?? ''}`}</>

  // `shown` is null until the animation actually starts, so every other state —
  // server render, pre-hydration, reduced motion, already-visible — prints the
  // authored figure verbatim.
  const display = phase === 'animating' && shown !== null ? String(shown) : authored
  return (
    <>
      {display}
      {tail}
    </>
  )
}
