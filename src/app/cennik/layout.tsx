import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cennik kreatora CV — jednorazowa płatność od 15 zł',
  description: 'Jednorazowa płatność, bez subskrypcji. Wybierz plan i stwórz profesjonalne CV już od 15 zł. BLIK i karta.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'}/cennik` },
  openGraph: {
    title: 'Cennik kreatora CV — jednorazowa płatność od 15 zł — CVPro.pl',
    description: 'Jednorazowa płatność, bez subskrypcji. Wybierz plan i stwórz profesjonalne CV już od 15 zł.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'}/cennik`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

const pricingLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CVPro.pl',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: `${BASE}/cennik`,
  offers: [
    { '@type': 'Offer', name: 'Plan Podstawowy', price: '15', priceCurrency: 'PLN', url: `${BASE}/cennik`, category: 'one-time' },
    { '@type': 'Offer', name: 'Plan Pro', price: '29', priceCurrency: 'PLN', url: `${BASE}/cennik`, category: 'one-time' },
    { '@type': 'Offer', name: 'Plan Premium', price: '39', priceCurrency: 'PLN', url: `${BASE}/cennik`, category: 'one-time' },
  ],
}

export default function CennikLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingLd) }} />
      {children}
    </>
  )
}
