import type { MetadataRoute } from 'next'
import { WZORY } from '@/lib/wzory-cv'
import { ARTICLES } from '@/lib/poradnik'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

// Real content-change dates — bump manually when a page's content actually changes,
// so Google isn't told "everything changed" on every deploy.
const HOME_UPDATED = new Date('2026-07-03')
const CENNIK_UPDATED = new Date('2026-07-03')
const WZORY_UPDATED = new Date('2026-06-27')
const LEGAL_UPDATED = new Date('2026-06-28')
const KONTAKT_UPDATED = new Date('2026-06-28')

export default function sitemap(): MetadataRoute.Sitemap {
  const poradnikLatest = new Date(
    ARTICLES.map(a => a.dateModified).sort().at(-1) ?? '2026-06-28'
  )

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: HOME_UPDATED,   changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/cennik`,              lastModified: CENNIK_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/kreator-cv-bez-subskrypcji`, lastModified: HOME_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/wzory-cv`,            lastModified: WZORY_UPDATED,  changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/poradnik`,            lastModified: poradnikLatest, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/kontakt`,             lastModified: KONTAKT_UPDATED, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/regulamin`,           lastModified: LEGAL_UPDATED,  changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/polityka-prywatnosci`,lastModified: LEGAL_UPDATED,  changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const wzoryPages: MetadataRoute.Sitemap = WZORY.map(w => ({
    url: `${BASE}/wzory-cv/${w.slug}`,
    lastModified: WZORY_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const poradnikPages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${BASE}/poradnik/${a.slug}`,
    lastModified: new Date(a.dateModified),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...wzoryPages, ...poradnikPages]
}
