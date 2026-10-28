import type { FormaPagamento, Locacao, StatusLocacao } from '../types'
import { aparelhosAluguel, diasEntre, hojeISO, locacoesSeed } from './mock'
import { gravar, ler } from './storage'

const KEY = 'foneflex:locacoes'

export const listarLocacoes = () => ler<Locacao[]>(KEY, locacoesSeed)

export const statusLocacao = (l: Locacao): StatusLocacao =>
  l.devolvidoEm ? 'Devolvido' : l.limite < hojeISO() ? 'Atrasado' : 'Ativo'

export const diasAtraso = (l: Locacao) => (statusLocacao(l) === 'Atrasado' ? diasEntre(l.limite, hojeISO()) : 0)

export const disponiveis = (locacoes: Locacao[]) =>
  aparelhosAluguel.filter((a) => !locacoes.some((l) => l.aparelho === a.nome && !l.devolvidoEm))

export type NovaLocacao = {
  clienteId: string
  aparelho: string
  imei: string
  inicio: string
  limite: string
  valorDia: number
  caucao: number
  pagamentoCaucao: FormaPagamento
}

export function criarLocacao(dados: NovaLocacao): Locacao[] {
  const lista = listarLocacoes()
  const ultimo = Math.max(0, ...lista.map((l) => Number(l.id.replace('LOC-', ''))))
  const atualizada = [{ ...dados, id: `LOC-${String(ultimo + 1).padStart(3, '0')}` }, ...lista]
  gravar(KEY, atualizada)
  return atualizada
}

export function registrarDevolucao(id: string, condicao: string): Locacao[] {
  const atualizada = listarLocacoes().map((l) => (l.id === id ? { ...l, devolvidoEm: hojeISO(), condicao } : l))
  gravar(KEY, atualizada)
  return atualizada
}
