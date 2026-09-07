'use client'

import { Children, isValidElement, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import { useInView } from './use-in-view'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Animation direction: 'up' | 'down' | 'left' | 'right' */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Duration in seconds */
  duration?: number
  /** Delay in seconds */
  delay?: number
  /** Distance to travel in px */
  distance?: number
  /** Stagger delay for multiple children (seconds) */
  stagger?: number
}

/**
 * Reveal animation — fades + slides elements into view when they enter the viewport.
 *
 * CSS transitions driven by one IntersectionObserver, not framer-motion. The
 * props are unchanged from the framer version on purpose: thirty-five
 * components across two templates use this, and none of them had to be touched.
 *
 * The travel distance, duration and delay are passed as CSS custom properties
 * so the whole animation is a single declarative rule in `globals.css` — see
 * `[data-reveal]` there, which also handles `prefers-reduced-motion`.
 */
function offsetVars(
  direction: ScrollRevealProps['direction'],
  distance: number,
): CSSProperties {
  switch (direction) {
    case 'down':
      return { '--reveal-y': `-${distance}px` } as CSSProperties
    case 'left':
      return { '--reveal-x': `${distance}px` } as CSSProperties
    case 'right':
      return { '--reveal-x': `-${distance}px` } as CSSProperties
    default:
      return { '--reveal-y': `${distance}px` } as CSSProperties
  }
}

export default function ScrollReveal({
  children,
  className,
  direction = 'up',
  duration = 0.8,
  delay = 0,
  distance = 40,
  stagger = 0,
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const base: CSSProperties = {
    ...offsetVars(direction, distance),
    '--reveal-duration': `${duration}s`,
  } as CSSProperties

  if (stagger) {
    return (
      <div ref={ref} className={cn(className)}>
        {Children.map(children, (child, i) =>
          isValidElement(child) ? (
            <div
              key={i}
              data-reveal={inView ? 'in' : 'out'}
              style={{ ...base, '--reveal-delay': `${delay + i * stagger}s` } as CSSProperties}
            >
              {child}
            </div>
          ) : (
            child
          ),
        )}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      data-reveal={inView ? 'in' : 'out'}
      style={{ ...base, '--reveal-delay': `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}
