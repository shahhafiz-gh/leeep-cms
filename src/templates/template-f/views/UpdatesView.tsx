'use client'

import { useParams } from 'next/navigation'
import PageSection from '@/shared/PageSection'
import type { SchoolData } from '@/types/school.types'
import UpdatesHero from '../components/updates/UpdatesHero'
import AnnouncementsList from '../components/updates/AnnouncementsList'
import EventsList from '../components/updates/EventsList'
import UpdateDetail from '../components/updates/UpdateDetail'

/**
 * Template D ("Almanac") — Updates.
 *
 * `/updates/[id]` renders through this same view (the routes share one template
 * entry point), so the id is read from the route params here and switches the
 * page between the feed and a single article.
 */
export default function UpdatesView({ data }: { data: SchoolData }) {
  const params = useParams<{ id?: string }>()
  const id = params?.id

  if (id) return <UpdateDetail data={data} id={id} />

  return (
    <>
      <UpdatesHero data={data} />
      <PageSection id="news">
        <AnnouncementsList data={data} />
      </PageSection>
      <PageSection id="events">
        <EventsList data={data} />
      </PageSection>
    </>
  )
}
