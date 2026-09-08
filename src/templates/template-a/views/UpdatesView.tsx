'use client'

import { useParams } from 'next/navigation'
import PageSection from '@/shared/PageSection'
import type { SchoolData } from '@/types/school.types'
import UpdatesHero from '../components/updates/UpdatesHero'
import AnnouncementsList from '../components/updates/AnnouncementsList'
import EventsList from '../components/updates/EventsList'
import UpdateDetail from '../components/updates/UpdateDetail'

/** Template A — Updates Page View (IEIskp style) */
export default function UpdatesView({ data }: { data: SchoolData }) {
  const params = useParams<{ id?: string }>()
  const id = params?.id

  return (
    <div className="font-(family-name:--font-dm-sans) bg-ta-background text-ta-on-background">
      {id ? (
        <UpdateDetail data={data} id={id} />
      ) : (
        <>
          <UpdatesHero data={data} />
          <PageSection id="news">
            <AnnouncementsList data={data} />
          </PageSection>
          <EventsList data={data} />
        </>
      )}
    </div>
  )
}
