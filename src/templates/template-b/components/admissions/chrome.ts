import type { AdmissionChrome } from '@/shared/AdmissionFormBody'

/**
 * Template B's admission look, shared by the admissions information page and the
 * application form page — the two are one journey, so they must not drift apart.
 */
export const chrome: AdmissionChrome = {
  input:
    'w-full border border-tb-border rounded-lg px-4 py-3 text-tb-heading placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-tb-primary-400 focus:border-tb-primary-400 transition-colors bg-white disabled:opacity-70',
  label: 'block text-sm font-semibold text-tb-heading mb-2',
  help: 'text-xs text-tb-body',
  sectionTitle: 'text-lg font-bold text-tb-heading',
  heading: 'text-xl font-bold text-tb-heading mb-5 border-b border-tb-border pb-3',
  bodyText: 'text-tb-body leading-relaxed',
  stateTitle: 'text-2xl font-bold text-tb-heading',
  errorText: 'text-sm font-medium text-red-600',
  accentIcon: 'text-tb-primary-400',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
  chip: 'inline-flex items-center gap-1.5 rounded-full border border-tb-border bg-tb-primary-50/60 px-3 py-1.5 text-xs font-medium text-tb-body',
  uploadCard:
    'border-2 border-dashed border-tb-border rounded-xl p-6 text-center transition-colors cursor-pointer bg-tb-primary-50/30 hover:bg-tb-primary-50 text-tb-primary-400',
  uploadCardFilled:
    'border-2 border-dashed border-tb-primary-400 rounded-xl p-6 text-center transition-colors cursor-pointer bg-tb-primary-50 text-tb-primary-400',
  tick: 'accent-tb-primary-400 rounded',
  subtleButton: 'text-sm font-semibold text-tb-primary-400 hover:underline',
  panel: 'bg-tb-primary-50/40 border border-tb-border rounded-xl p-6',
  primaryButton:
    'inline-flex items-center gap-2 bg-tb-primary-400 text-white font-semibold rounded-lg px-8 py-3.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60',
  secondaryButton:
    'inline-flex items-center gap-2 border border-tb-border bg-white text-tb-heading font-semibold rounded-lg px-4 py-2 text-sm hover:bg-tb-primary-50 transition-colors',
  stepActive: 'rounded-lg px-4 py-2 text-sm font-semibold bg-tb-primary-400 text-white transition-colors',
  stepIdle:
    'rounded-lg px-4 py-2 text-sm font-semibold bg-white border border-tb-border text-tb-body hover:text-tb-heading transition-colors',
  table: 'w-full min-w-[640px] border-collapse text-left',
  tableHead: 'border-b border-tb-border px-4 py-3 text-xs font-bold uppercase tracking-wide text-tb-body',
  tableCell: 'border-b border-tb-border px-4 py-3 text-sm text-tb-heading align-middle',
}
