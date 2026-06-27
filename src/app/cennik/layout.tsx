import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cennik – CVPro.pl',
  description: 'Jednorazowa płatność, bez subskrypcji. Wybierz plan i stwórz profesjonalne CV już od 15 zł. BLIK, karta, PayPal.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'}/cennik` },
  openGraph: {
    title: 'Cennik – CVPro.pl',
    description: 'Jednorazowa płatność, bez subskrypcji. Wybierz plan i stwórz profesjonalne CV już od 15 zł.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'}/cennik`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function CennikLayout({ children }: { children: React.ReactNode }) {
  return children
}
