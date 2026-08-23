import type React from 'react'
import type { PageType, SchoolData } from '@/types/school.types'
import { withEditorNavigation } from '@/lib/cms'
import { getEditorDemoData } from '@/lib/demo'
import TemplateA from '@/templates/template-a/TemplateA'
import TemplateB from '@/templates/template-b/TemplateB'
import TemplateC from '@/templates/template-c/TemplateC'
import TemplateD from '@/templates/template-d/TemplateD'
import TemplateE from '@/templates/template-e/TemplateE'
import TemplateF from '@/templates/template-f/TemplateF'
import { styleObject } from '@/lib/component-styles'

function styleSelector(path: string) {
  const escaped = path.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `[data-style="${escaped}"],[data-edit="${escaped}"],[data-bind="${escaped}"]`
}

function styleCss(data: SchoolData) {
  return Object.keys(data.styles ?? {})
    .map((path) => {
      const styles = styleObject(data, path) as Record<string, string | number>
      const declarations = Object.entries(styles)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${value}`)
        .join(';')
      return declarations ? `${styleSelector(path)}{${declarations}}` : ''
    })
    .filter(Boolean)
    .join('\n')
}

function withSavedStyles(node: React.ReactNode, data: SchoolData) {
  const css = styleCss(data)
  if (!css) return node
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {node}
    </>
  )
}

/**
 * Render the correct template for a school's data.
 *
 * The template is chosen ONLY from `data.config.template_id` — never from a URL
 * param. A missing/unknown value defaults to `template-a` with a warning so the
 * page still renders instead of crashing. This rule lives here so all routes
 * behave identically.
 *
 * When `editing` (editor preview), we render the fully-populated DEMO content
 * (matched to the school's template) instead of the school's own draft/published
 * data — so the admin always sees a complete, working example to edit over and
 * knows what to write where. The school's real data is untouched; live renders
 * always use it.
 */
export function renderTemplate(data: SchoolData, page: PageType, school: string, editing = false) {
  const templateId = data.config?.template_id

  if (editing) {
    // Demo content keyed to the school's template, with editor-friendly nav.
    const demo = getEditorDemoData(
      templateId === 'template-b'
        ? 'B'
        : templateId === 'template-d'
          ? 'D'
          : templateId === 'template-e'
            ? 'E'
            : templateId === 'template-f'
              ? 'F'
              : 'A',
    )
    const renderData = withEditorNavigation(demo)
    // Social links are the school's real IDENTITY/config, not "content to write
    // over" — so overlay the real (published) URLs onto the demo's fixed platform
    // slots instead of showing the demo's empty '#' placeholders. This makes
    // already-configured platforms render as configured (green tick) on load and
    // survive a refresh, matching the live site. Un-configured slots keep the demo
    // placeholder so every platform stays available to set up. Matching by
    // platform (not index) keeps it correct even if the orders differ.
    const realUrlByPlatform = new Map((data.socialLinks ?? []).map((s) => [s.platform, s.url]))
    const editorData: SchoolData = {
      ...renderData,
      socialLinks: renderData.socialLinks.map((s) => {
        const realUrl = realUrlByPlatform.get(s.platform)
        return realUrl != null ? { ...s, url: realUrl } : s
      }),
    }
    // Keep the school's real config (template_id + palette) on the demo data so
    // the preview renders in the chosen template AND palette.
    editorData.config = { ...editorData.config, ...data.config }
    // Carry over saved per-component style overrides so the scaffold reflects them
    // on load (the builder also re-applies them live via apply-style).
    if (data.styles) editorData.styles = data.styles
    if (templateId === 'template-b') return withSavedStyles(<TemplateB data={editorData} page={page} editing />, editorData)
    if (templateId === 'template-c') return withSavedStyles(<TemplateC data={editorData} page={page} editing />, editorData)
    if (templateId === 'template-d') return withSavedStyles(<TemplateD data={editorData} page={page} editing />, editorData)
    if (templateId === 'template-e') return withSavedStyles(<TemplateE data={editorData} page={page} editing />, editorData)
    if (templateId === 'template-f') return withSavedStyles(<TemplateF data={editorData} page={page} editing />, editorData)
    return withSavedStyles(<TemplateA data={editorData} page={page} editing />, editorData)
  }

  if (templateId === 'template-b') return withSavedStyles(<TemplateB data={data} page={page} />, data)
  if (templateId === 'template-c') return withSavedStyles(<TemplateC data={data} page={page} />, data)
  if (templateId === 'template-d') return withSavedStyles(<TemplateD data={data} page={page} />, data)
  if (templateId === 'template-e') return withSavedStyles(<TemplateE data={data} page={page} />, data)
  if (templateId === 'template-f') return withSavedStyles(<TemplateF data={data} page={page} />, data)

  if (templateId !== 'template-a') {
    console.warn(
      `[cms] Unknown or missing config.template_id (${String(templateId)}) for ` +
        `school="${school}"; defaulting to template-a.`,
    )
  }
  return withSavedStyles(<TemplateA data={data} page={page} />, data)
}
