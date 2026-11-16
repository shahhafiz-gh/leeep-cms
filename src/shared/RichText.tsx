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
/**
 * Does this school-authored HTML actually say anything?
 *
 * The editor never saves an empty string once it has been touched: a cleared
 * field comes back as `<div class="ql-editor read-mode"><p><br></p></div>`.
 * That is truthy, so a plain `html ? <RichText/> : fallback` printed a blank
 * block and the fallback copy never showed.
 */
export function hasRichText(html?: string | null): boolean {
  if (!html) return false
  if (/<(img|iframe|video|table)\b/i.test(html)) return true
  return (
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .trim() !== ''
  )
}

export default function RichText({ html, className = '' }: { html: string; className?: string }) {
  const isMarkup = /<\/?[a-z][^>]*>/i.test(html)

  return (
    <div
      className={`website-rich-content ${isMarkup ? '' : 'whitespace-pre-line'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
