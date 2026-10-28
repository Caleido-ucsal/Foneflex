import type { OrdemServico, OsStatus } from '../types'
import { ordensSeed } from './mock'

const KEY = 'foneflex:ordens'

export const STATUS: OsStatus[] = ['Em Análise', 'Aguardando Peça', 'Pronto para Retirada', 'Entregue', 'Cancelado']
export const TECNICOS = ['Diego Alves', 'Priscila Ramos']
export const ABERTA = (s: OsStatus) => s !== 'Entregue' && s !== 'Cancelado'

export function listarOrdens(): OrdemServico[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* usa seed */
  }
  return ordensSeed
}

function salvar(lista: OrdemServico[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista))
  } catch {
    /* mantém em memória */
  }
}

export type NovaOS = Pick<OrdemServico, 'clienteId' | 'aparelho' | 'defeito' | 'tecnico' | 'valor'>

export function abrirOrdem(dados: NovaOS): OrdemServico[] {
  const lista = listarOrdens()
  const ultimo = Math.max(0, ...lista.map((o) => Number(o.id.replace('OS-', ''))))
  const nova: OrdemServico = {
    ...dados,
    id: `OS-${String(ultimo + 1).padStart(4, '0')}`,
    data: new Date().toISOString().slice(0, 10),
    status: 'Em Análise',
  }
  const atualizada = [nova, ...lista]
  salvar(atualizada)
  return atualizada
}

export function alterarStatus(id: string, status: OsStatus): OrdemServico[] {
  const atualizada = listarOrdens().map((o) => (o.id === id ? { ...o, status } : o))
  salvar(atualizada)
  return atualizada
}
