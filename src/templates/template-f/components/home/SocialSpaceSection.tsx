'use client'

import { Icon } from '@iconify/react'
import type { SchoolData, SocialPost } from '@/types/school.types'
import { useLiveList } from '@/shared/hooks/useLiveList'
import Photo from '../common/Photo'
import { Eyebrow } from '../common/Bits'
import AddItemButton from '@/shared/AddItemButton'

/** Platform → icon. Matches the icon set the footer's social links already use. */
const PLATFORM_ICON: Record<string, string> = {
  instagram: 'ri:instagram-line',
  facebook: 'ri:facebook-fill',
  twitter: 'ri:twitter-x-fill',
  youtube: 'ri:youtube-fill',
  linkedin: 'ri:linkedin-fill',
}

/**
 * "Social space" — the school's feed wall, on an ink panel.
 *
 * Deliberately NOT an embed. A real timeline embed drops a third-party script
 * onto every school site, breaks whenever a platform changes its rules, leaks
 * visitor data, and shows nothing at all when a school's account is quiet. These
 * posts are authored in the builder, so the wall is always full, always fast,
 * and keeps working whatever the platforms do next.
 *
 * A post links out only when the school gave it a URL — a card that looks
 * clickable but goes nowhere is worse than a card that plainly doesn't.
 */
export default function SocialSpaceSection({ data }: { data: SchoolData }) {
  const social = data.socialSpace
  const posts = useLiveList<SocialPost>('socialSpace.posts', social?.posts ?? [])
  if (posts.length === 0) return null

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
      <div className="rounded-[28px] bg-tf-ink px-6 py-12 md:px-10 lg:px-14 lg:py-16">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Eyebrow onInk data-edit="socialSpace.subtitle">
              {social?.subtitle || 'Social space'}
            </Eyebrow>
            <h2
              data-edit="socialSpace.title"
              className="max-w-[18ch] text-[32px] leading-[1.05] text-tf-on-ink sm:text-[40px] lg:text-[48px]"
            >
              {social?.title || 'From the school feed'}
            </h2>
          </div>
          {social?.handle && (
            <span
              data-edit="socialSpace.handle"
              className="tf-serif shrink-0 text-[20px] text-tf-accent-soft italic lg:text-[24px]"
            >
              {social.handle}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const icon = PLATFORM_ICON[post.platform ?? ''] ?? 'ri:global-line'
            const body = (
              <>
                <div className="aspect-square overflow-hidden rounded-t-[18px]">
                  <Photo
                    fill
                    src={post.image}
                    alt={post.caption}
                    caption="post photo"
                    editPath={`socialSpace.posts.${i}.image`}
                    rounded=""
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col gap-2 px-5 pt-4 pb-5">
                  <span className="flex items-center gap-2 text-[11.5px] tracking-[0.1em] text-tf-on-ink-faint uppercase">
                    <Icon icon={icon} className="h-4 w-4 shrink-0" aria-hidden />
                    <span data-edit={`socialSpace.posts.${i}.date`}>{post.date}</span>
                  </span>
                  <span
                    data-edit={`socialSpace.posts.${i}.caption`}
                    className="text-[15px] leading-[1.5] text-tf-on-ink-body"
                  >
                    {post.caption}
                  </span>
                </div>
              </>
            )

            const card =
              'flex flex-col overflow-hidden rounded-[18px] bg-tf-ink-soft ring-1 ring-tf-ink-line transition-colors'

            return post.url ? (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} hover:ring-tf-accent-soft`}
              >
                {body}
              </a>
            ) : (
              <div key={i} className={card}>
                {body}
              </div>
            )
          })}
        </div>

        {/* Editor-only, outside the grid so it can't disturb the card rhythm. */}
        <AddItemButton path="socialSpace.posts" label="Add post" />
      </div>
    </section>
  )
}
