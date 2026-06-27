import type { CVData } from './types'

export type ATSTip = {
  type: 'error' | 'warning' | 'ok'
  message: string
}

export type ATSResult = {
  score: number
  tips: ATSTip[]
}

export function analyzeATS(cv: CVData): ATSResult {
  const tips: ATSTip[] = []
  let score = 0
  const max = 100

  // Summary check
  if (!cv.summary || cv.summary.length < 50) {
    tips.push({ type: 'error', message: 'Dodaj podsumowanie zawodowe — ATS i rekruterzy czytają je jako pierwsze.' })
  } else if (cv.summary.length < 100) {
    tips.push({ type: 'warning', message: 'Podsumowanie jest krótkie. Rozwiń je do 2–4 zdań.' })
    score += 5
  } else {
    tips.push({ type: 'ok', message: 'Podsumowanie zawodowe jest kompletne.' })
    score += 10
  }

  // Experience check
  if (cv.experience.length === 0) {
    tips.push({ type: 'error', message: 'Dodaj co najmniej jedno doświadczenie zawodowe.' })
  } else {
    score += 20
    const withBullets = cv.experience.filter(e => e.bullets.length >= 2)
    if (withBullets.length < cv.experience.length) {
      tips.push({ type: 'warning', message: 'Niektóre pozycje doświadczenia mają mniej niż 2 punkty opisu. Dodaj szczegóły.' })
    } else {
      tips.push({ type: 'ok', message: 'Doświadczenie zawodowe jest dobrze opisane.' })
      score += 10
    }

    const withDates = cv.experience.filter(e => e.startDate && e.endDate)
    if (withDates.length < cv.experience.length) {
      tips.push({ type: 'warning', message: 'Uzupełnij daty dla wszystkich pozycji doświadczenia.' })
    } else {
      score += 5
    }
  }

  // Education check
  if (cv.education.length === 0) {
    tips.push({ type: 'warning', message: 'Dodaj wykształcenie — nawet jeśli jesteś specjalistą, ATS często go szuka.' })
  } else {
    tips.push({ type: 'ok', message: 'Wykształcenie jest uzupełnione.' })
    score += 10
  }

  // Skills check
  if (cv.skills.length < 3) {
    tips.push({ type: 'error', message: 'Dodaj co najmniej 5 umiejętności — ATS skanuje je pod słowa kluczowe z ogłoszenia.' })
  } else if (cv.skills.length < 6) {
    tips.push({ type: 'warning', message: 'Masz mało umiejętności. Dodaj więcej słów kluczowych z branży.' })
    score += 5
  } else {
    tips.push({ type: 'ok', message: `Umiejętności: ${cv.skills.length} pozycji — dobrze.` })
    score += 15
  }

  // Contact info check
  const hasContact = cv.email && cv.phone
  if (!hasContact) {
    tips.push({ type: 'error', message: 'Uzupełnij email i telefon — bez nich rekruter nie może się skontaktować.' })
  } else {
    score += 10
    if (!cv.linkedin) {
      tips.push({ type: 'warning', message: 'Rozważ dodanie LinkedIn — 87% rekruterów sprawdza profil przed rozmową.' })
    } else {
      score += 5
    }
  }

  // Languages
  if (cv.languages.length === 0) {
    tips.push({ type: 'warning', message: 'Dodaj języki — nawet "Polski ojczysty" jest ważny dla ATS.' })
  } else {
    tips.push({ type: 'ok', message: 'Języki są uzupełnione.' })
    score += 10
  }

  // Title check
  if (!cv.title) {
    tips.push({ type: 'error', message: 'Dodaj stanowisko zawodowe pod swoim imieniem.' })
  } else {
    score += 5
  }

  return { score: Math.min(score, max), tips }
}
