'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'

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

/**
 * Stagger animation — children animate in sequentially when scrolled into view.
 * Framer Motion implementation (replaces the GSAP version).
 */
export default function StaggerChildren({
  children,
  className,
  stagger = 0.1,
  duration = 0.5,
  delay = 0,
}: StaggerChildrenProps) {
  // Each child reveals on its OWN in-view trigger (rather than being orchestrated
  // by a one-time parent `whileInView`). That keeps the staggered entrance on
  // first load AND — crucially for the editor — reveals cards ADDED later: a
  // parent-orchestrated `once` reveal fires before the new card exists, leaving it
  // pinned at opacity 0 ("a space but nothing in it"). A self-triggering child in
  // view animates in immediately.
  return (
    <div className={cn(className)}>
      {Children.map(children, (child, i) =>
        isValidElement(child) ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration, ease: 'easeOut', delay: delay + i * stagger }}
          >
            {child}
          </motion.div>
        ) : (
          child
        ),
      )}
    </div>
  )
}
