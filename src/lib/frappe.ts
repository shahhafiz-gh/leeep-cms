import axios from 'axios'
import type { SchoolData } from '@/types/school.types'
import { placeholderTemplateAData, mockKcgsData } from './mock'

/**
 * Frappe API client for the LEEEP CMS backend.
 *
 * Known Frappe instances:
 * - IEIskp:             https://iei.leeep.in
 * - Kashmir-Cambridge:  https://kcs.leeep.in
 *
 * API endpoints used in the source repos:
 * - /api/method/education.education.api.get_website_announcements
 * - /api/method/education.education.api.get_website_events
 * - /api/method/education.education.api.get_website_event?name={id}
 * - /api/method/education.education.api.get_website_announcement?name={id}
 */

const frappeClient = axios.create({
  baseURL: process.env.FRAPPE_API_URL ?? 'https://iei.leeep.in',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

/**
 * Fetch full school data by subdomain.
 * The Frappe backend resolves which school & template config to return.
 */
export async function getSchoolData(subdomain: string): Promise<SchoolData | null> {
  try {
    const res = await frappeClient.get('/api/method/education.education.api.get_school_data', {
      params: { subdomain },
    })

    if (res.data?.message) {
      return res.data.message as SchoolData
    }

    // If API succeeds but returns no data, throw to trigger fallback
    throw new Error('No data returned from API')
  } catch {
    // Serve mock data in local dev, or on preview/demo deployments
    // (e.g. *.vercel.app) where DEMO_FALLBACK is enabled. Real production
    // multi-tenant hosting leaves this unset so unknown schools 404.
    const allowFallback =
      process.env.NODE_ENV !== 'production' || process.env.DEMO_FALLBACK === 'true'
    if (!allowFallback) return null
    // DEMO_SUBDOMAIN lets a preview deploy force which mock school to show,
    // regardless of the host (the bare *.vercel.app URL has no real subdomain).
    const effective = process.env.DEMO_SUBDOMAIN ?? subdomain
    if (effective === 'kcgs' || effective === 'kcs') return mockKcgsData
    return placeholderTemplateAData
  }
}

/**
 * Resolve the full media URL from a Frappe file path.
 * Frappe stores files as "/files/image.jpg" — we prepend the base URL.
 */
export function resolveFrappeMediaUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const baseURL = process.env.FRAPPE_API_URL ?? 'https://iei.leeep.in'
  return `${baseURL}${encodeURI(path)}`
}
