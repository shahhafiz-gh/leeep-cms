import type { AdmissionChrome } from '@/shared/AdmissionFormBody'

/**
 * Template A's admission look, shared by the admissions information page and the
 * application form page — the two are one journey, so they must not drift apart.
 * Behaviour lives in `shared/AdmissionInfoBody` and `shared/AdmissionFormBody`.
 */
export const chrome: AdmissionChrome = {
  input:
    'w-full border border-ta-outline-variant rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-ta-primary focus:border-ta-primary bg-ta-surface-container-lowest text-ta-on-surface font-(family-name:--font-ta-body-md) text-ta-body-md transition-colors disabled:opacity-70',
  label: 'font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface font-bold',
  help: 'font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant',
  sectionTitle: 'font-(family-name:--font-ta-h3) text-xl text-ta-on-surface',
  heading:
    'font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface mb-5 border-b border-ta-outline-variant pb-3',
  bodyText: 'font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface-variant',
  stateTitle: 'font-(family-name:--font-ta-h3) text-2xl text-ta-on-surface',
  errorText: 'font-(family-name:--font-ta-body-md) text-ta-body-md text-red-600',
  accentIcon: 'text-ta-primary',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  chip: 'inline-flex items-center gap-1.5 rounded-full bg-ta-surface-container-low border border-ta-outline-variant px-3 py-1.5 font-(family-name:--font-ta-caption) text-xs text-ta-on-surface-variant',
  uploadCard:
    'border-2 border-dashed border-ta-outline-variant bg-ta-surface-container-low hover:bg-ta-surface-container rounded-xl p-6 text-center transition-colors cursor-pointer text-ta-primary',
  uploadCardFilled:
    'border-2 border-dashed border-ta-primary bg-ta-surface-container-low rounded-xl p-6 text-center transition-colors cursor-pointer text-ta-primary',
  tick: 'accent-ta-primary rounded',
  subtleButton: 'font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-primary hover:underline',
  panel: 'bg-ta-surface-container-low p-6 rounded-xl border border-ta-outline-variant',
  primaryButton:
    'inline-flex items-center gap-2 bg-ta-primary-container text-ta-on-primary font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full px-8 py-4 hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100',
  secondaryButton:
    'inline-flex items-center gap-2 border border-ta-outline-variant text-ta-on-surface font-(family-name:--font-ta-label-md) text-ta-label-md rounded-full px-5 py-2 hover:bg-ta-surface-container transition-colors',
  stepActive:
    'rounded-full px-4 py-2 font-(family-name:--font-ta-label-md) text-ta-label-md bg-ta-primary-container text-ta-on-primary transition-colors',
  stepIdle:
    'rounded-full px-4 py-2 font-(family-name:--font-ta-label-md) text-ta-label-md bg-ta-surface-container-low text-ta-on-surface-variant hover:bg-ta-surface-container transition-colors',
  table: 'w-full min-w-[640px] border-collapse text-left',
  tableHead:
    'border-b border-ta-outline-variant px-4 py-3 font-(family-name:--font-ta-label-md) text-ta-label-md text-ta-on-surface-variant font-bold',
  tableCell:
    'border-b border-ta-outline-variant px-4 py-3 font-(family-name:--font-ta-body-md) text-ta-body-md text-ta-on-surface align-middle',
}
