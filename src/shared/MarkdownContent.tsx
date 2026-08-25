import ReactMarkdown from 'react-markdown'

interface MarkdownContentProps {
  source: string
  className?: string
}

const spacing = [
  '[&_p]:my-2',
  '[&_p:first-child]:mt-0',
  '[&_p:last-child]:mb-0',
  '[&_h1]:mb-2 [&_h1]:mt-5',
  '[&_h2]:mb-2 [&_h2]:mt-5',
  '[&_h3]:mb-1.5 [&_h3]:mt-4',
  '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
  '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
  '[&_li]:my-0.5',
  '[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4',
  '[&_img]:my-4 [&_img]:max-w-full',
].join(' ')

/** Render new Markdown announcements while preserving existing HTML records. */
export default function MarkdownContent({ source, className = '' }: MarkdownContentProps) {
  const isLegacyHtml = /<\/?[a-z][^>]*>/i.test(source)

  return (
    <div className={`${spacing} ${className}`}>
      {isLegacyHtml ? (
        <div dangerouslySetInnerHTML={{ __html: source }} />
      ) : (
        <ReactMarkdown>{source}</ReactMarkdown>
      )}
    </div>
  )
}
