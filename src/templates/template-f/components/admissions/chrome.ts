import type { AdmissionChrome } from '@/shared/AdmissionFormBody'

/**
 * Almanac's admission look, shared by the admissions information page and the
 * application form page — flat and ruled, hairline inputs on paper.
 */
export const chrome: AdmissionChrome = {
  input:
    'w-full rounded-[10px] border border-tf-border-strong bg-tf-paper px-3.5 py-3 text-[15px] text-tf-ink outline-none transition-colors focus:border-tf-accent disabled:opacity-70',
  label: 'text-[13px] font-medium text-tf-body',
  help: 'text-[12px] leading-[1.5] text-tf-body/80',
  sectionTitle: 'text-[17px] tracking-[-0.02em] text-tf-ink',
  heading: 'mb-6 border-b border-tf-border pb-3 text-[21px] tracking-[-0.025em] text-tf-ink',
  bodyText: 'text-[16px] leading-[1.6] text-tf-body',
  stateTitle: 'text-[30px] tracking-[-0.025em] text-tf-ink',
  errorText: 'text-[14px] text-tf-accent',
  accentIcon: 'text-tf-accent',
  grid: 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3',
  chip: 'inline-flex items-center gap-1.5 rounded-full border border-tf-border bg-tf-paper px-3 py-1.5 text-[12px] text-tf-body',
  uploadCard:
    'cursor-pointer rounded-[10px] border border-dashed border-tf-border-strong bg-tf-paper p-6 text-center text-tf-accent transition-colors hover:border-tf-accent',
  uploadCardFilled:
    'cursor-pointer rounded-[10px] border border-dashed border-tf-accent bg-tf-paper p-6 text-center text-tf-accent transition-colors',
  tick: 'accent-tf-accent rounded',
  subtleButton: 'text-[13px] font-medium text-tf-accent hover:underline',
  panel: 'rounded-[18px] border border-tf-border bg-tf-paper p-6',
  primaryButton:
    'inline-flex items-center gap-2 rounded-full bg-tf-ink px-8 py-3.5 text-[14px] font-medium text-tf-paper transition-opacity hover:opacity-90 disabled:opacity-60',
  secondaryButton:
    'inline-flex items-center gap-2 rounded-full border border-tf-border-strong px-4 py-2 text-[13px] font-medium text-tf-ink transition-colors hover:border-tf-accent',
  stepActive: 'rounded-full bg-tf-ink px-4 py-2 text-[13px] font-medium text-tf-paper transition-colors',
  stepIdle:
    'rounded-full border border-tf-border px-4 py-2 text-[13px] font-medium text-tf-body transition-colors hover:border-tf-accent',
  table: 'w-full min-w-[640px] border-collapse text-left',
  tableHead: 'border-b border-tf-border px-4 py-3 text-[12px] font-medium uppercase tracking-[0.06em] text-tf-body',
  tableCell: 'border-b border-tf-border px-4 py-3 text-[15px] text-tf-ink align-middle',
}
