'use client'

import { Icon } from '@iconify/react'
import { type SchemaStep } from './admission-schema'

/**
 * The application form's progress stepper — shared by every template.
 *
 * ONE horizontal row of steps, one per section the school configured on its
 * Application Form screen. The DocType's tabs used to add a second level above
 * this — a heading per tab with its sections stacked underneath — but tabs are a
 * desk authoring detail no school ever sees, so the family read a two-level
 * outline of a structure that meant nothing to them. The section is the unit the
 * school controls and the unit the wizard walks, so it is the only unit shown.
 *
 * Rendered only when there is more than one step: a single-section form is just
 * a form, and a one-item stepper is noise.
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

  return (
    <nav aria-label="Application steps">
      <ol className="flex flex-row flex-wrap items-center gap-2">
        {steps.map((step, index) => {
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
    </nav>
  )
}
