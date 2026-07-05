'use client'

import { useParams } from 'next/navigation'
import type { SchoolData } from '@/types/school.types'
import PageHero from '../components/common/PageHero'
import NewsList from '../components/updates/NewsList'
import EventsList from '../components/updates/EventsList'
import UpdateDetail from '../components/updates/UpdateDetail'

/** Template B — Updates Page View (Kashmir-Cambridge style) */
export default function UpdatesView({ data }: { data: SchoolData }) {
  const params = useParams<{ id?: string }>()
  const id = params?.id

  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      {id ? (
        <UpdateDetail data={data} id={id} />
      ) : (
        <>
          <PageHero
            eyebrow={data.updatesHero?.subtitle ?? 'Stay Informed'}
            title={data.updatesHero?.title ?? 'News & Events'}
            description={
              data.updatesHero?.description ??
              `Stay updated with the latest announcements, important news, and upcoming events at ${data.name}.`
            }
            eyebrowEditPath="updatesHero.subtitle"
            titleEditPath="updatesHero.title"
            descriptionEditPath="updatesHero.description"
          />
          <NewsList data={data} />
          <EventsList data={data} />
        </>
      )}
    </div>
  )
}
