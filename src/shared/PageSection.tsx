import type { ReactNode } from 'react'

/**
 * An anchor target for a menu link.
 *
 * The website menu is built server-side from a catalogue of destinations
 * (`education/website_builder.py`, NAV_BLUEPRINT), and a dropdown entry like
 * "Vision & Mission" points at `/about#vision-mission`. That id has to exist on
 * the page or the link scrolls nowhere — this wrapper is where it lives, so the
 * section components stay unaware of navigation.
 *
 * `scroll-mt` keeps the heading clear of the sticky header the templates put
 * over the top of the page.
 */
export default function PageSection({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 lg:scroll-mt-28">
      {children}
    </div>
  )
}
