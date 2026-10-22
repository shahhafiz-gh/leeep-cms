import type { SchoolData } from '@/types/school.types'

/**
 * Where "Login" goes: the school's own Leeep app (`https://mmis.leeep.in/login`).
 *
 * The CMS serves no `/login` of its own, so a relative link 404s on the public
 * site. Falls back to `/login` only where no backend is known (mocks, demo).
 */
export function loginHref(data: SchoolData): string {
  return data.backendUrl ? `${data.backendUrl.replace(/\/$/, '')}/login` : '/login'
}
