import type { FormaPagamento, ItemVenda, Produto, Venda } from '../types'
import { hojeISO, produtosSeed } from './mock'
import { gravar, ler } from './storage'

const K_PROD = 'foneflex:produtos'
const K_VENDAS = 'foneflex:vendas'

export const FORMAS: FormaPagamento[] = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro']

export const listarProdutos = () => ler<Produto[]>(K_PROD, () => produtosSeed)
export const listarVendas = () => ler<Venda[]>(K_VENDAS, () => [])

export type NovaVenda = { itens: ItemVenda[]; clienteId?: string; pagamento: FormaPagamento }

export function registrarVenda({ itens, clienteId, pagamento }: NovaVenda) {
  const vendas = listarVendas()
  const ultimo = Math.max(0, ...vendas.map((v) => Number(v.id.replace('VD-', ''))))
  const venda: Venda = {
    id: `VD-${String(ultimo + 1).padStart(4, '0')}`,
    data: hojeISO(),
    clienteId,
    itens,
    pagamento,
    total: itens.reduce((t, i) => t + i.preco * i.qtd, 0),
  }
  gravar(K_VENDAS, [venda, ...vendas])

  const produtos = listarProdutos().map((p) => {
    const item = itens.find((i) => i.produtoId === p.id)
    return item ? { ...p, estoque: Math.max(0, p.estoque - item.qtd) } : p
  })
  gravar(K_PROD, produtos)
  return { venda, produtos }
}
