import { Poppins, DM_Sans, Lato, Playfair_Display } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-poppins', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const lato = Lato({ subsets: ['latin'], weight: ['400','700'], variable: '--font-lato', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export default function CVEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.variable} ${dmSans.variable} ${lato.variable} ${playfair.variable}`}>
      {children}
    </div>
  )
}
