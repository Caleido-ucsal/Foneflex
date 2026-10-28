const digits = (v: string) => v.replace(/\D/g, '')

export function maskCpf(v: string) {
  const d = digits(v).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function maskTelefone(v: string) {
  const d = digits(v).slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const cpfValido = (v: string) => digits(v).length === 11
export const telefoneValido = (v: string) => digits(v).length >= 10
