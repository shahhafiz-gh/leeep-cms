import { Icon } from '@iconify/react'
import type { CustomPageBlock } from '@/types/school.types'
import MarkdownContent from '@/shared/MarkdownContent'
import { toMapEmbedUrl } from '@/shared/map-embed'
import ImagesBlock from './ImagesBlock'
import TableBlock from './TableBlock'
import FormBlock from './FormBlock'

/** Prose styling for Markdown bodies, in the template's own type. */
export const PROSE =
  'text-[16px] leading-8 text-ts-body [&_a]:font-semibold [&_a]:text-ts-primary [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ts-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ts-heading [&_li]:pl-1 [&_strong]:text-ts-heading [&_blockquote]:border-ts-accent [&_blockquote]:italic [&_blockquote]:text-ts-primary-700'

interface PageBlocksProps {
  blocks: CustomPageBlock[]
  /** The page's slug (forms post against it) and its builder edit path. */
  page: string
  basePath?: string
}

/**
 * A custom page's body, block by block. Each block may carry a heading and an
 * intro line; an empty block renders nothing rather than an empty frame.
 */
export default function PageBlocks({ blocks, page, basePath }: PageBlocksProps) {
  // A form without a formId is addressed by its position among the page's forms
  // (the server's _find_form_block counts the same way).
  const formIndexes = blocks.map((block, index) =>
    blocks.slice(0, index).filter((b) => b?.type === 'form').length,
  )
  return (
    <div className="space-y-10">
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object') return null
        const path = basePath ? `${basePath}.${index}` : undefined
        const body = renderBody(block, page, path, block.formId || String(formIndexes[index]))
        if (!body && !block.heading && !(block.type !== 'text' && block.body)) return null
        return (
          <section key={index}>
            {block.heading && (
              <h2
                data-edit={path ? `${path}.heading` : undefined}
                className="mb-4 flex items-center gap-3 text-2xl font-bold text-ts-heading"
              >
                <span className="h-7 w-1.5 shrink-0 rounded-full bg-ts-accent" />
                {block.heading}
              </h2>
            )}
            {block.type !== 'text' && block.body && (
              <MarkdownContent source={block.body} className={`${PROSE} mb-5`} />
            )}
            {body}
          </section>
        )
      })}
    </div>
  )
}

function renderBody(block: CustomPageBlock, page: string, path: string | undefined, formId: string) {
  switch (block.type) {
    case 'text':
      return block.body ? (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-ts-line sm:p-8">
          <MarkdownContent source={block.body} className={PROSE} />
        </div>
      ) : null
    case 'images':
      return block.images?.some((image) => image?.src) ? (
        <ImagesBlock images={block.images} layout={block.layout || 'grid'} basePath={path ? `${path}.images` : undefined} />
      ) : null
    case 'table':
      return block.rows?.length ? <TableBlock block={block} /> : null
    case 'files':
      return block.files?.length ? <FilesList files={block.files} /> : null
    case 'form':
      return <FormBlock block={block} page={page} formId={formId} />
    case 'map': {
      const src = toMapEmbedUrl(block.url)
      return src ? (
        <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-ts-line">
          <iframe
            src={src}
            title={block.heading || 'Map'}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[380px] w-full border-0"
          />
        </div>
      ) : null
    }
    case 'people':
      return block.people?.length ? <People people={block.people} path={path} /> : null
    default:
      return null
  }
}

function FilesList({ files }: { files: NonNullable<CustomPageBlock['files']> }) {
  return (
    <ul className="divide-y divide-ts-line overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ts-line">
      {files.map((file, i) => {
        const pdf = /\.pdf($|\?)/i.test(file.url ?? '')
        return (
          <li key={i} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ts-primary-50 text-ts-primary">
              <Icon icon={pdf ? 'lucide:file-text' : 'lucide:file'} className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-ts-heading">{file.label}</span>
              {(file.description || file.date) && (
                <span className="mt-0.5 block text-sm text-ts-muted">
                  {file.description}
                  {file.description && file.date ? ' · ' : ''}
                  {file.date}
                </span>
              )}
            </span>
            {file.url ? (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-ts-accent px-4 py-2 text-sm font-bold text-ts-navy transition-colors hover:bg-ts-accent-600"
              >
                <Icon icon="lucide:download" className="h-4 w-4" />
                Download
              </a>
            ) : (
              <span className="text-sm text-ts-muted">Coming soon</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function People({ people, path }: { people: NonNullable<CustomPageBlock['people']>; path?: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {people.map((person, i) => (
        <figure key={i} className="m-0 overflow-hidden rounded-xl bg-white text-center shadow-sm ring-1 ring-ts-line">
          {person.image ? (
            <img
              src={person.image}
              alt={person.name}
              loading="lazy"
              data-edit-img={path ? `${path}.people.${i}.image` : undefined}
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <span className="grid aspect-[4/5] place-items-center bg-ts-primary-50 text-ts-primary">
              <Icon icon="lucide:user" className="h-10 w-10" />
            </span>
          )}
          <figcaption className="px-3 py-3">
            <span className="block font-bold text-ts-heading">{person.name}</span>
            {person.role && <span className="block text-sm text-ts-muted">{person.role}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
