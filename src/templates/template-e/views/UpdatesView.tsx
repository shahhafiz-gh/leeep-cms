'use client'

import { useParams } from 'next/navigation'
import PageSection from '@/shared/PageSection'
import type { SchoolData } from '@/types/school.types'
import { Container, PageIntro } from '../components/common/Bits'
import NewsList from '../components/updates/NewsList'
import EventsList from '../components/updates/EventsList'
import UpdateDetail from '../components/updates/UpdateDetail'

/**
 * Template E ("Ledger") — Updates.
 *
 * `/updates/[id]` renders through this same view (the routes share one template
 * entry point), so the id is read from the route params here and switches the
 * page between the register and a single article.
 */
export default function UpdatesView({ data }: { data: SchoolData }) {
  const params = useParams<{ id?: string }>()
  const id = params?.id

  if (id) return <UpdateDetail data={data} id={id} />

  return (
    <>
      <Container className="pt-10 sm:pt-12 lg:pt-14">
        <PageIntro
          title={data.updatesHero?.title || 'News'}
          titlePath="updatesHero.title"
          lede={data.updatesHero?.description}
          ledePath="updatesHero.description"
        />
      </Container>
      <PageSection id="news">
        <NewsList data={data} />
      </PageSection>
      <PageSection id="events">
        <EventsList data={data} />
      </PageSection>
    </>
  )
}
