'use client'

import { Icon } from '@iconify/react'
import { groupStepsByTab, type SchemaStep } from './admission-schema'

/**
 * The application form's progress stepper — shared by every template.
 *
 * One step per section (the same unit the wizard walks), regrouped under the tab
 * the school authored each section in, so the family reads the hierarchy rather
 * than one flat run of headings. Rendered only when there is more than one step:
 * a single-section form is just a form, and a one-item stepper is noise.
 *
 * The look comes from the template through `stepActive` / `stepIdle` — the same
 * chrome the admissions info page uses for its window selector — so this adds no
 * new tokens to any template.
 */

export interface AdmissionStepperStyles {
  /** Chip for the step the family is on. */
  stepActive: string
  /** Chip for every other step. */
  stepIdle: string
  /** Tab group heading. */
  label: string
}

export interface AdmissionStepperProps {
  steps: SchemaStep[]
  /** The step being shown. */
  stepIndex: number
  /** Furthest step reached — anything up to here can be jumped to. */
  maxStepReached: number
  /** Jump to a step (the caller gates this to visited steps). */
  onSelect: (index: number) => void
  styles: AdmissionStepperStyles
}

export default function AdmissionStepper({
  steps,
  stepIndex,
  maxStepReached,
  onSelect,
  styles,
}: AdmissionStepperProps) {
  // A stepper for one step tells the family nothing they cannot already see.
  if (steps.length <= 1) return null

  const groups = groupStepsByTab(steps)

  return (
    <nav aria-label="Application steps" className="flex flex-col gap-4">
      {groups.map((group, groupIndex) => (
        <div key={group.tab || `group-${groupIndex}`} className="flex flex-col gap-2">
          {group.tab && (
            <span className={`${styles.label} text-[11px] uppercase tracking-[0.12em] opacity-70`}>
              {group.tab}
            </span>
          )}
          <ol className="flex flex-wrap gap-2">
            {group.steps.map(({ step, index }) => {
              const isActive = index === stepIndex
              // Reachable = already visited (or the current step). Forward steps
              // stay locked so their required fields are answered in order.
              const reachable = index <= maxStepReached
              const isDone = reachable && !isActive
              return (
                <li key={index}>
                  <button
                    type="button"
                    aria-current={isActive ? 'step' : undefined}
                    disabled={!reachable}
                    onClick={() => onSelect(index)}
                    className={`inline-flex items-center gap-2 ${
                      isActive ? styles.stepActive : styles.stepIdle
                    } ${reachable ? '' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                      {isDone ? <Icon icon="lucide:check" className="text-[13px]" /> : index + 1}
                    </span>
                    <span>{step.label || `Step ${index + 1}`}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </nav>
  )
}
