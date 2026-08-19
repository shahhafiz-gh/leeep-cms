import type { AdmissionChrome } from '@/shared/AdmissionFormBody'

/**
 * Ledger's admission look, shared by the admissions information page and the
 * application form page — square white fields, serif rules, paper-form feel.
 */
export const chrome: AdmissionChrome = {
  input:
    'w-full border border-te-rule-strong bg-te-white px-3 py-2.5 text-[14px] text-te-ink outline-none transition-colors focus:border-te-accent disabled:opacity-70',
  label: 'text-[13px] font-semibold tracking-[0.02em] text-te-ink',
  help: 'text-[12px] leading-[1.55] text-te-body',
  sectionTitle: 'text-[17px] text-te-ink',
  heading: 'mb-5 border-b border-te-rule pb-2.5 text-[19px] text-te-ink sm:text-[21px]',
  bodyText: 'text-[15px] leading-[1.65] text-te-body',
  stateTitle: 'font-(family-name:--font-te-serif) text-[26px] text-te-accent',
  errorText: 'text-[14px] text-red-600',
  accentIcon: 'text-te-accent',
  grid: 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
  chip: 'inline-flex items-center gap-1.5 border border-te-rule bg-te-white px-3 py-1.5 text-[12px] text-te-body',
  uploadCard:
    'cursor-pointer border border-dashed border-te-rule-strong bg-te-white p-6 text-center text-te-accent transition-colors hover:border-te-accent',
  uploadCardFilled:
    'cursor-pointer border border-dashed border-te-accent bg-te-white p-6 text-center text-te-accent transition-colors',
  tick: 'accent-te-accent',
  subtleButton: 'text-[13px] font-semibold text-te-accent hover:underline',
  panel: 'border border-te-rule bg-te-white p-6',
  primaryButton:
    'inline-flex items-center gap-2 bg-te-accent px-8 py-3 text-[14px] font-semibold text-te-white transition-opacity hover:opacity-90 disabled:opacity-60',
  secondaryButton:
    'inline-flex items-center gap-2 border border-te-rule-strong px-4 py-2 text-[13px] font-semibold text-te-ink transition-colors hover:border-te-accent',
  stepActive: 'border border-te-accent bg-te-accent px-4 py-2 text-[13px] font-semibold text-te-white',
  stepIdle:
    'border border-te-rule px-4 py-2 text-[13px] font-semibold text-te-body transition-colors hover:border-te-accent',
  table: 'w-full min-w-[640px] border-collapse text-left',
  tableHead: 'border-b border-te-rule px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-te-body',
  tableCell: 'border-b border-te-rule px-4 py-3 text-[14px] text-te-ink align-middle',
}
