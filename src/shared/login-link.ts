import type { SchoolData } from '@/types/school.types'

/**
 * Where "Login" goes.
 *
 * A school can set its own link (Website Management → Settings → `loginUrl`);
 * otherwise it is the school's own Leeep origin (`https://mmis.leeep.in`), whose
 * root sends a signed-out visitor to sign in. The CMS serves no `/login` of its
 * own, so `/login` is only the last resort where no backend is known (mocks, demo).
 */
export function loginHref(data: SchoolData): string {
  const custom = data.loginUrl?.trim()
  if (custom && /^https?:\/\//i.test(custom)) return custom
  if (data.backendUrl) return data.backendUrl.replace(/\/$/, '')
  return '/login'
}
