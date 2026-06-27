export type ExperienceItem = {
  company: string
  position: string
  startDate: string
  endDate: string
  city?: string
  bullets: string[]
}

export type EducationItem = {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  grade?: string
}

export type LanguageItem = {
  name: string
  level: string
}

export type CertificationItem = {
  name: string
  issuer: string
  date: string
}

export type CVTemplate =
  | 'classic'
  | 'modern'
  | 'warsaw'
  | 'elegant'
  | 'bold'
  | 'academic'
  | 'luxury'
  | 'minimal'
  | 'professional'
  | 'creative'
  | 'startup'
  | 'timeline'
  | 'technical'
  | 'compact'
  | 'executive'
  | 'nordic'

export type CVData = {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  city: string
  country: string
  linkedin?: string
  github?: string
  website?: string
  photo?: string
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  languages: LanguageItem[]
  hobbies?: string[]
  certifications?: CertificationItem[]
  template: CVTemplate
  colorTheme: string
  language: 'pl' | 'en'
  situation?: string
  jobAd?: string
}

export const EMPTY_CV: CVData = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  phone: '',
  city: '',
  country: 'Polska',
  linkedin: '',
  github: '',
  website: '',
  photo: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: [],
  certifications: [],
  template: 'classic',
  colorTheme: '#2563eb',
  language: 'pl',
  situation: '',
  jobAd: '',
}

export const COLOR_THEMES = [
  { label: 'Niebieski', value: '#2563eb' },
  { label: 'Morski', value: '#22C7D6' },
  { label: 'Zielony', value: '#16a34a' },
  { label: 'Bordowy', value: '#9f1239' },
  { label: 'Ciepły szary', value: '#78716c' },
]

export const ALL_TEMPLATES: { id: CVTemplate; label: string; desc: string; minPlan: string }[] = [
  { id: 'classic',      label: 'Klasyczny',       desc: 'Sidebar, Poppins',         minPlan: 'free' },
  { id: 'modern',       label: 'Nowoczesny',       desc: 'Hero header, DM Sans',     minPlan: 'free' },
  { id: 'warsaw',       label: 'Warszawski',       desc: 'Dwukolumnowy, Onest',      minPlan: 'free' },
  { id: 'elegant',      label: 'Elegancki',        desc: 'Serif, Playfair',          minPlan: 'basic' },
  { id: 'bold',         label: 'Odważny',          desc: 'Dark header, Onest',       minPlan: 'basic' },
  { id: 'academic',     label: 'Akademicki',       desc: 'Serif, siatka dat',        minPlan: 'basic' },
  { id: 'luxury',       label: 'Ekskluzywny',      desc: 'Navy + złoto',             minPlan: 'pro' },
  { id: 'minimal',      label: 'Minimalistyczny',  desc: 'Czyste linie',             minPlan: 'pro' },
  { id: 'professional', label: 'Profesjonalny',    desc: 'Tradycyjny, ATS',          minPlan: 'pro' },
  { id: 'creative',     label: 'Kreatywny',        desc: 'Boczny akcent',            minPlan: 'pro' },
  { id: 'startup',      label: 'Startupowy',       desc: 'Gradient, karty',          minPlan: 'pro' },
  { id: 'timeline',     label: 'Oś czasu',         desc: 'Chronologiczny, dark',     minPlan: 'pro' },
  { id: 'technical',    label: 'Techniczny',       desc: 'Siatka, monospace',        minPlan: 'premium' },
  { id: 'compact',      label: 'Kompaktowy',       desc: 'Więcej treści',            minPlan: 'premium' },
  { id: 'executive',    label: 'Dyrektorski',      desc: 'Premium, prestiżowy',      minPlan: 'premium' },
  { id: 'nordic',       label: 'Skandynawski',     desc: 'Ultra-minimalistyczny',    minPlan: 'premium' },
]

export const SITUATION_CHIPS = [
  { id: 'career-change', label: '🔄 Zmiana branży', hint: 'Transferowalne umiejętności' },
  { id: 'abroad', label: '✈️ Praca za granicą', hint: 'Języki i mobilność' },
  { id: 'graduate', label: '🎓 Świeży absolwent', hint: 'Projekty i potencjał' },
  { id: 'gap', label: '⏸️ Luka w CV', hint: 'Pozytywne ujęcie przerwy' },
  { id: 'remote', label: '🏠 Praca zdalna', hint: 'Samodzielność i dyscyplina' },
  { id: 'promotion', label: '📈 Awans wewnętrzny', hint: 'Osiągnięcia i postęp' },
  { id: 'visa', label: '🛂 Sponsorship wizy', hint: 'Status prawny i języki' },
  { id: 'return', label: '↩️ Powrót na rynek', hint: 'Świeże umiejętności' },
]

export const LANGUAGE_LEVELS = [
  'A1 – Podstawowy',
  'A2 – Elementarny',
  'B1 – Średniozaawansowany',
  'B2 – Wyższy średniozaawansowany',
  'C1 – Zaawansowany',
  'C2 – Biegły',
  'Ojczysty',
]

export const PLAN_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3 }

export function planAllows(userPlan: string, required: string): boolean {
  return (PLAN_ORDER[userPlan] ?? 0) >= (PLAN_ORDER[required] ?? 0)
}
