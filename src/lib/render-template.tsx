import type { PageType, SchoolData } from '@/types/school.types'
import { withEditorNavigation } from '@/lib/cms'
import { getEditorDemoData } from '@/lib/demo'
import TemplateA from '@/templates/template-a/TemplateA'
import TemplateB from '@/templates/template-b/TemplateB'

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
    const demo = getEditorDemoData(templateId === 'template-b' ? 'B' : 'A')
    const renderData = withEditorNavigation(demo)
    return templateId === 'template-b'
      ? <TemplateB data={renderData} page={page} />
      : <TemplateA data={renderData} page={page} />
  }

  if (templateId === 'template-b') return <TemplateB data={data} page={page} />

  if (templateId !== 'template-a') {
    console.warn(
      `[cms] Unknown or missing config.template_id (${String(templateId)}) for ` +
        `school="${school}"; defaulting to template-a.`,
    )
  }
  return <TemplateA data={data} page={page} />
}
