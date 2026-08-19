import type { AdmissionChrome } from '@/shared/AdmissionFormBody'

/**
 * Quill's admission look, shared by the admissions information page and the
 * application form page — flat and ruled, hairline inputs on paper.
 */
export const chrome: AdmissionChrome = {
  input:
    'w-full rounded-[10px] border border-td-border-strong bg-td-paper px-3.5 py-3 text-[15px] text-td-ink outline-none transition-colors focus:border-td-accent disabled:opacity-70',
  label: 'text-[13px] font-medium text-td-body',
  help: 'text-[12px] leading-[1.5] text-td-body/80',
  sectionTitle: 'text-[17px] tracking-[-0.02em] text-td-ink',
  heading: 'mb-6 border-b border-td-border pb-3 text-[21px] tracking-[-0.025em] text-td-ink',
  bodyText: 'text-[16px] leading-[1.6] text-td-body',
  stateTitle: 'text-[30px] tracking-[-0.025em] text-td-ink',
  errorText: 'text-[14px] text-td-accent',
  accentIcon: 'text-td-accent',
  grid: 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3',
  chip: 'inline-flex items-center gap-1.5 rounded-full border border-td-border bg-td-paper px-3 py-1.5 text-[12px] text-td-body',
  uploadCard:
    'cursor-pointer rounded-[10px] border border-dashed border-td-border-strong bg-td-paper p-6 text-center text-td-accent transition-colors hover:border-td-accent',
  uploadCardFilled:
    'cursor-pointer rounded-[10px] border border-dashed border-td-accent bg-td-paper p-6 text-center text-td-accent transition-colors',
  tick: 'accent-td-accent rounded',
  subtleButton: 'text-[13px] font-medium text-td-accent hover:underline',
  panel: 'rounded-[18px] border border-td-border bg-td-paper p-6',
  primaryButton:
    'inline-flex items-center gap-2 rounded-full bg-td-ink px-8 py-3.5 text-[14px] font-medium text-td-paper transition-opacity hover:opacity-90 disabled:opacity-60',
  secondaryButton:
    'inline-flex items-center gap-2 rounded-full border border-td-border-strong px-4 py-2 text-[13px] font-medium text-td-ink transition-colors hover:border-td-accent',
  stepActive: 'rounded-full bg-td-ink px-4 py-2 text-[13px] font-medium text-td-paper transition-colors',
  stepIdle:
    'rounded-full border border-td-border px-4 py-2 text-[13px] font-medium text-td-body transition-colors hover:border-td-accent',
  table: 'w-full min-w-[640px] border-collapse text-left',
  tableHead: 'border-b border-td-border px-4 py-3 text-[12px] font-medium uppercase tracking-[0.06em] text-td-body',
  tableCell: 'border-b border-td-border px-4 py-3 text-[15px] text-td-ink align-middle',
}
