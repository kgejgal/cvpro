import type { Metadata } from 'next'
import { Poppins, DM_Sans, Lato, Playfair_Display } from 'next/font/google'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Same font variables as the editor layout, so a shared CV looks like the one the owner built
// (without them every template silently fell back to the body font).
const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-poppins', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const lato = Lato({ subsets: ['latin'], weight: ['400','700'], variable: '--font-lato', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export default function PublicCVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.variable} ${dmSans.variable} ${lato.variable} ${playfair.variable}`}>
      {children}
    </div>
  )
}
