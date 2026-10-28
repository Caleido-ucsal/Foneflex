/* Persistência simples em localStorage com fallback para o valor inicial (Fase 1 sem back-end). */
export function ler<T>(chave: string, inicial: () => T): T {
  try {
    const raw = localStorage.getItem(chave)
    if (raw) return JSON.parse(raw) as T
  } catch {
    /* usa inicial */
  }
  return inicial()
}

export function gravar<T>(chave: string, valor: T) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* mantém só em memória */
  }
}
