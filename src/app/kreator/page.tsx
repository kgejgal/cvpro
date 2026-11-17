import type { Metadata } from 'next'
import GuestEditor from './GuestEditor'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvpro.pl'

export const metadata: Metadata = {
  title: 'Kreator CV online, zacznij bez rejestracji',
  description: 'Stwórz CV w kilka minut i zobacz podgląd na żywo, zanim założysz konto. Płatność jednorazowa od 15 zł, bez subskrypcji.',
  alternates: { canonical: `${BASE}/kreator` },
  openGraph: {
    title: 'Kreator CV online, zacznij bez rejestracji | CVPro.pl',
    description: 'Stwórz CV w kilka minut i zobacz podgląd na żywo. Konto zakładasz dopiero przy pobieraniu.',
    url: `${BASE}/kreator`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function KreatorPage() {
  return <GuestEditor />
}
