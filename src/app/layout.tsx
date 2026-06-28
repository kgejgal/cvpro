import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.css'

const onest = Onest({ subsets: ['latin'], variable: '--font-onest', display: 'swap', preload: true, adjustFontFallback: false })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'
const TITLE = 'CVPro.pl – Stwórz profesjonalne CV w minuty'
const DESC = 'Generator CV zoptymalizowany pod ATS. 16 szablonów, eksport PDF, analiza ATS. Dostosowany do polskiego rynku pracy. Jednorazowa płatność – bez subskrypcji.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s | CVPro.pl' },
  description: DESC,
  keywords: ['CV', 'kreator CV', 'szablon CV', 'generator CV', 'CV po polsku', 'CV do pracy', 'ATS', 'curriculum vitae', 'życiorys zawodowy'],
  authors: [{ name: 'CVPro.pl' }],
  creator: 'CVPro.pl',
  publisher: 'CVPro.pl',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE_URL,
    siteName: 'CVPro.pl',
    title: TITLE,
    description: DESC,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'CVPro.pl – Profesjonalne CV w języku polskim' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'CVPro.pl',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/opengraph-image` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'CVPro.pl',
      description: DESC,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'pl-PL',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/wzory-cv?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'CVPro.pl',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description: DESC,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'PLN',
        lowPrice: '0',
        highPrice: '39',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      className={onest.variable}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-onest), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
