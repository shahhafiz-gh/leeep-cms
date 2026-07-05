import type { SchoolData } from '@/types/school.types'
import PageHero from '../components/common/PageHero'
import StreamsSection from '../components/academics/StreamsSection'
import MethodologySection from '../components/academics/MethodologySection'
import ResultsSection from '../components/academics/ResultsSection'
import ClubsSection from '../components/academics/ClubsSection'

/** Template B — Academics Page View (Kashmir-Cambridge style) */
export default function AcademicsView({ data }: { data: SchoolData }) {
  return (
    <div className="font-[family-name:var(--font-hind)] bg-tb-background text-tb-foreground">
      <PageHero
        eyebrow={data.academics.subtitle || 'Academic Excellence'}
        eyebrowEditPath="academics.subtitle"
        title={data.academics.title || 'Academics'}
        titleEditPath="academics.title"
        description={data.academics.description}
        descriptionEditPath="academics.description"
      />
      <StreamsSection data={data} />
      <MethodologySection data={data} />
      <ResultsSection data={data} />
      <ClubsSection data={data} />
    </div>
  )
}
