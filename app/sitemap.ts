import type { MetadataRoute } from 'next'
import { PHONES_DATABASE } from '@/lib/phones-data'
import { VILLES_SEO } from '@/lib/villes-seo'

const BASE_URL = 'https://www.vigusb.fr'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Pages principales
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/telephones`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/reparation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/magasins`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/simulation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/qui-sommes-nous`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Pages produits téléphones
  const phonePages: MetadataRoute.Sitemap = PHONES_DATABASE.map(p => ({
    url: `${BASE_URL}/telephones/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Pages SEO locales — réparation iPhone
  const iphonePages: MetadataRoute.Sitemap = VILLES_SEO.map(v => ({
    url: `${BASE_URL}/reparation/iphone/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Pages SEO locales — réparation téléphone
  const repairPages: MetadataRoute.Sitemap = VILLES_SEO.map(v => ({
    url: `${BASE_URL}/reparation/telephone/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Pages SEO locales — réparation Samsung
  const samsungPages: MetadataRoute.Sitemap = VILLES_SEO.map(v => ({
    url: `${BASE_URL}/reparation/samsung/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Pages SEO locales — téléphone reconditionné
  const occasionPages: MetadataRoute.Sitemap = VILLES_SEO.map(v => ({
    url: `${BASE_URL}/telephone/occasion/${v.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...phonePages,
    ...iphonePages,
    ...repairPages,
    ...samsungPages,
    ...occasionPages,
  ]
}
