import type React from 'react'
import type { PageType, SchoolData } from '@/types/school.types'
import { withEditorNavigation } from '@/lib/cms'
import TemplateA from '@/templates/template-a/TemplateA'
import TemplateB from '@/templates/template-b/TemplateB'
import TemplateC from '@/templates/template-c/TemplateC'
import TemplateD from '@/templates/template-d/TemplateD'
import TemplateE from '@/templates/template-e/TemplateE'
import TemplateF from '@/templates/template-f/TemplateF'
import TemplateG from '@/templates/template-g/TemplateG'
import TemplateH from '@/templates/template-h/TemplateH'
import { styleObject } from '@/lib/component-styles'
import { ImageOptimizationProvider } from '@/shared/SiteImage'

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
 * Editor previews use the school's draft data and add editor-only navigation.
 * The same template components render preview and live output.
 */
export function renderTemplate(data: SchoolData, page: PageType, school: string, editing = false) {
  // Absent means on: the switch is newer than most sites (see SiteImage).
  const vercelImages = data.config?.vercel_image_optimization !== false
  return (
    <ImageOptimizationProvider vercel={vercelImages}>
      {pickTemplate(data, page, school, editing)}
    </ImageOptimizationProvider>
  )
}

function pickTemplate(data: SchoolData, page: PageType, school: string, editing: boolean) {
  const templateId = data.config?.template_id
  const renderData = editing ? withEditorNavigation(data) : data

  if (templateId === 'template-b') return withSavedStyles(<TemplateB data={renderData} page={page} editing={editing} />, renderData)
  if (templateId === 'template-c') return withSavedStyles(<TemplateC data={renderData} page={page} editing={editing} />, renderData)
  if (templateId === 'template-d') return withSavedStyles(<TemplateD data={renderData} page={page} editing={editing} />, renderData)
  if (templateId === 'template-e') return withSavedStyles(<TemplateE data={renderData} page={page} editing={editing} />, renderData)
  if (templateId === 'template-f') return withSavedStyles(<TemplateF data={renderData} page={page} editing={editing} />, renderData)
  if (templateId === 'template-g') return withSavedStyles(<TemplateG data={renderData} page={page} editing={editing} />, renderData)
  if (templateId === 'template-h') return withSavedStyles(<TemplateH data={renderData} page={page} editing={editing} />, renderData)

  if (templateId !== 'template-a') {
    console.warn(
      `[cms] Unknown or missing config.template_id (${String(templateId)}) for ` +
        `school="${school}"; defaulting to template-a.`,
    )
  }
  return withSavedStyles(<TemplateA data={renderData} page={page} editing={editing} />, renderData)
}
