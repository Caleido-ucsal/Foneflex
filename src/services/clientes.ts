import type { Cliente } from '../types'
import { clientesSeed } from './mock'

const KEY = 'foneflex:clientes'

export function listarClientes(): Cliente[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignora e usa seed */
  }
  return clientesSeed
}

function salvar(lista: Cliente[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista))
  } catch {
    /* armazenamento indisponível: mantém só em memória */
  }
}

export type NovoCliente = Omit<Cliente, 'id' | 'desde'>

export function cadastrarCliente(dados: NovoCliente): Cliente[] {
  const novo: Cliente = { ...dados, id: `c${Date.now()}`, desde: new Date().toISOString().slice(0, 10) }
  const lista = [...listarClientes(), novo]
  salvar(lista)
  return lista
}

export const nomeCliente = (id: string) => listarClientes().find((c) => c.id === id)?.nome ?? '—'

export const acharPorCpf = (cpf: string) => listarClientes().find((c) => c.cpf === cpf)
