import type { MetadataRoute } from 'next'
import { WZORY } from '@/lib/wzory-cv'
import { ARTICLES } from '@/lib/poradnik'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/cennik`,              lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/kreator-cv-bez-subskrypcji`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/wzory-cv`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/poradnik`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/kontakt`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE}/regulamin`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/polityka-prywatnosci`,lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const wzoryPages: MetadataRoute.Sitemap = WZORY.map(w => ({
    url: `${BASE}/wzory-cv/${w.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const poradnikPages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${BASE}/poradnik/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...wzoryPages, ...poradnikPages]
}
