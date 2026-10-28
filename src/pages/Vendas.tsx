import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, FilterTabs } from '../components/ui'
import { listarClientes } from '../services/clientes'
import { brl, dataBR } from '../services/mock'
import { FORMAS, listarProdutos, registrarVenda } from '../services/vendas'
import type { FormaPagamento, ItemVenda, Produto, Venda } from '../types'
import styles from './Vendas.module.css'

const FILTROS = ['Todos', 'Smartphones', 'Acessórios'] as const
type Filtro = (typeof FILTROS)[number]

const icone = (p: Produto) => (p.categoria === 'Smartphones' ? '📱' : '🔌')

export default function Vendas() {
  const [produtos, setProdutos] = useState(listarProdutos)
  const [filtro, setFiltro] = useState<Filtro>('Todos')
  const [busca, setBusca] = useState('')
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([])
  const [clienteTxt, setClienteTxt] = useState('')
  const [pagamento, setPagamento] = useState<FormaPagamento>('PIX')
  const [recibo, setRecibo] = useState<Venda | null>(null)

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return produtos.filter((p) => (filtro === 'Todos' || p.categoria === filtro) && p.nome.toLowerCase().includes(q))
  }, [produtos, filtro, busca])

  const cliente = useMemo(() => {
    const q = clienteTxt.trim().toLowerCase()
    if (!q) return undefined
    const digitos = q.replace(/\D/g, '')
    return listarClientes().find(
      (c) => c.nome.toLowerCase() === q || (digitos.length >= 11 && c.cpf.replace(/\D/g, '') === digitos),
    )
  }, [clienteTxt])

  const total = carrinho.reduce((t, i) => t + i.preco * i.qtd, 0)
  const qtdNoCarrinho = (id: string) => carrinho.find((i) => i.produtoId === id)?.qtd ?? 0

  const adicionar = (p: Produto) => {
    if (qtdNoCarrinho(p.id) >= p.estoque) return
    setRecibo(null)
    setCarrinho((c) =>
      c.some((i) => i.produtoId === p.id)
        ? c.map((i) => (i.produtoId === p.id ? { ...i, qtd: i.qtd + 1 } : i))
        : [...c, { produtoId: p.id, nome: p.nome, preco: p.preco, qtd: 1 }],
    )
  }

  const alterarQtd = (id: string, delta: number) => {
    const estoque = produtos.find((p) => p.id === id)?.estoque ?? 0
    setCarrinho((c) =>
      c.map((i) => (i.produtoId === id ? { ...i, qtd: Math.min(estoque, i.qtd + delta) } : i)).filter((i) => i.qtd > 0),
    )
  }

  const finalizar = () => {
    const { venda, produtos: atualizados } = registrarVenda({ itens: carrinho, clienteId: cliente?.id, pagamento })
    setProdutos(atualizados)
    setRecibo(venda)
    setCarrinho([])
    setClienteTxt('')
  }

  return (
    <div className={styles.layout}>
      <section>
        <PageHeader title="Vendas de Balcão" subtitle={`${produtos.length} produtos em estoque`} />
        <Card className={styles.filtros}>
          <FilterTabs options={FILTROS} value={filtro} onChange={setFiltro} />
          <input placeholder="Buscar produto..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </Card>

        <div className={styles.grid}>
          {visiveis.map((p) => {
            const esgotado = p.estoque - qtdNoCarrinho(p.id) <= 0
            return (
              <button key={p.id} className={styles.produto} onClick={() => adicionar(p)} disabled={esgotado}>
                <span className={styles.icone} aria-hidden="true">{icone(p)}</span>
                <strong>{p.nome}</strong>
                <small>{p.categoria}</small>
                <div>
                  <b>{brl(p.preco)}</b>
                  <span>{p.estoque === 0 ? 'Esgotado' : `${p.estoque} unidade${p.estoque > 1 ? 's' : ''}`}</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <Card className={styles.carrinho}>
        <header>
          <h2>Carrinho</h2>
          <small>{carrinho.reduce((t, i) => t + i.qtd, 0)} item(s)</small>
        </header>

        <div className={styles.itens}>
          {recibo && (
            <div className={styles.recibo} role="status">
              <b>Venda {recibo.id} registrada</b>
              <span>{dataBR(recibo.data)} · {recibo.pagamento} · {brl(recibo.total)}</span>
              <Button variant="secondary" onClick={() => window.print()}>Imprimir recibo</Button>
            </div>
          )}
          {carrinho.length === 0 && !recibo && <p className={styles.vazio}>🛒<br />Carrinho vazio</p>}
          {carrinho.map((i) => (
            <div key={i.produtoId} className={styles.linha}>
              <div><strong>{i.nome}</strong><small>{brl(i.preco)}</small></div>
              <div className={styles.qtd}>
                <button onClick={() => alterarQtd(i.produtoId, -1)} aria-label={`Remover ${i.nome}`}>−</button>
                <span>{i.qtd}</span>
                <button onClick={() => alterarQtd(i.produtoId, 1)} aria-label={`Adicionar ${i.nome}`}>＋</button>
              </div>
            </div>
          ))}
        </div>

        <footer>
          <label>
            Cliente (opcional)
            <input placeholder="Nome ou CPF" value={clienteTxt} onChange={(e) => setClienteTxt(e.target.value)} />
          </label>
          {cliente && <small className={styles.ok}>Cliente: {cliente.nome}</small>}

          <span className={styles.rotulo}>Forma de Pagamento</span>
          <div className={styles.formas}>
            {FORMAS.map((f) => (
              <button key={f} className={f === pagamento ? styles.sel : ''} onClick={() => setPagamento(f)}>{f}</button>
            ))}
          </div>

          <div className={styles.total}><span>Total</span><strong>{brl(total)}</strong></div>
          <Button block disabled={carrinho.length === 0} onClick={finalizar}>Finalizar Venda e Emitir Recibo</Button>
        </footer>
      </Card>
    </div>
  )
}
