'use client'

import { Children, isValidElement, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import { useInView } from './use-in-view'

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  /** Stagger delay between each child in seconds */
  stagger?: number
  /** Duration of each child's animation */
  duration?: number
  /** Initial delay before the stagger starts */
  delay?: number
}

/** One child, revealing on its own in-view trigger. */
function StaggeredChild({
  children,
  duration,
  delay,
}: {
  children: ReactNode
  duration: number
  delay: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className="h-full"
      data-reveal={inView ? 'in' : 'out'}
      style={
        {
          '--reveal-y': '20px',
          '--reveal-duration': `${duration}s`,
          '--reveal-delay': `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

/**
 * Stagger animation — children animate in sequentially when scrolled into view.
 *
 * CSS transitions plus one IntersectionObserver per child, replacing
 * framer-motion. Same props as before, so no consumer changed.
 *
 * Each child reveals on its OWN in-view trigger (rather than being orchestrated
 * by a one-time parent reveal). That keeps the staggered entrance on first load
 * AND — crucially for the editor — reveals cards ADDED later: a parent-
 * orchestrated `once` reveal fires before the new card exists, leaving it pinned
 * at opacity 0 ("a space but nothing in it"). A self-triggering child in view
 * animates in immediately.
 */
export default function StaggerChildren({
  children,
  className,
  stagger = 0.1,
  duration = 0.5,
  delay = 0,
}: StaggerChildrenProps) {
  return (
    <div className={cn(className)}>
      {Children.map(children, (child, i) =>
        isValidElement(child) ? (
          <StaggeredChild key={i} duration={duration} delay={delay + i * stagger}>
            {child}
          </StaggeredChild>
        ) : (
          child
        ),
      )}
    </div>
  )
}
