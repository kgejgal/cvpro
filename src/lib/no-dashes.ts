// Tekst z modelu trafia do CV i listów, gdzie długi myślnik (—) wygląda sztucznie. Zamieniamy go na przecinek.
export function noDashes(text: string): string {
  return text.replace(/\s*[—―]\s*/g, ', ').replace(/,\s*,/g, ',')
}
