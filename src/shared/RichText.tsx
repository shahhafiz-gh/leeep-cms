/**
 * School-authored HTML — admission rules, the introduction on the admissions
 * page, the note above the form.
 *
 * These bodies come out of the same Website management editor as announcements
 * and events, so they get the same `website-rich-content` treatment: without it
 * Tailwind's preflight has already stripped the list markers, heading sizes and
 * paragraph spacing the school put in, and the text lands as one flat block.
 *
 * Records saved before those fields had an editor hold plain text with real
 * newlines and no tags at all. HTML collapses those newlines, so line breaks are
 * honoured for that case instead — the same bargain `[data-edit]` slots make.
 */
export default function RichText({ html, className = '' }: { html: string; className?: string }) {
  const isMarkup = /<\/?[a-z][^>]*>/i.test(html)

  return (
    <div
      className={`website-rich-content ${isMarkup ? '' : 'whitespace-pre-line'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
