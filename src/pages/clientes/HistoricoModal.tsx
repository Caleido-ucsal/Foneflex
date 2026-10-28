import { useState } from 'react'
import { Modal } from '../../components/ui'
import { brl, dataBR } from '../../services/mock'
import { statusLocacao } from '../../services/locacoes'
import type { Cliente, Locacao, OrdemServico, Venda } from '../../types'
import styles from './HistoricoModal.module.css'

type Props = { cliente: Cliente; ordens: OrdemServico[]; compras: Venda[]; locacoes: Locacao[]; onClose: () => void }
type Aba = 'os' | 'compras' | 'alugueis'

export function HistoricoModal({ cliente, ordens, compras, locacoes, onClose }: Props) {
  const [aba, setAba] = useState<Aba>('os')
  const abas: { id: Aba; label: string; n: number }[] = [
    { id: 'os', label: 'Ordens de Serviço', n: ordens.length },
    { id: 'compras', label: 'Compras', n: compras.length },
    { id: 'alugueis', label: 'Aluguéis', n: locacoes.length },
  ]

  return (
    <Modal title="Histórico do Cliente" onClose={onClose} width={795}>
      <div className={styles.resumo}>
        <div className={styles.avatar}>👤</div>
        <div className={styles.info}>
          <strong>{cliente.nome}</strong>
          <span>{cliente.cpf} &nbsp; {cliente.telefone} &nbsp; {cliente.email}</span>
        </div>
        <div className={styles.kpi}><b>{ordens.length}</b><small>OS Total</small></div>
        <div className={styles.kpi}><b>{locacoes.length}</b><small>Aluguéis</small></div>
      </div>

      <div className={styles.tabs} role="tablist">
        {abas.map((a) => (
          <button key={a.id} role="tab" aria-selected={aba === a.id} className={aba === a.id ? styles.on : ''} onClick={() => setAba(a.id)}>
            {a.label} <span>{a.n}</span>
          </button>
        ))}
      </div>

      {aba === 'os' && (
        <Tabela
          cols={['Nº OS', 'Data', 'Aparelho', 'Defeito', 'Status', 'Valor']}
          rows={ordens.map((o) => [<span key="id" className="mono">{o.id}</span>, dataBR(o.data), o.aparelho, o.defeito, <b key="s">{o.status}</b>, brl(o.valor)])}
        />
      )}
      {aba === 'compras' && (
        <Tabela
          cols={['Nº', 'Data', 'Itens', 'Pagamento', 'Valor']}
          rows={compras.map((c) => [<span key="id" className="mono">{c.id}</span>, dataBR(c.data), c.itens.map((i) => `${i.qtd}x ${i.nome}`).join(', '), c.pagamento, brl(c.total)])}
        />
      )}
      {aba === 'alugueis' && (
        <Tabela
          cols={['Locação', 'Aparelho', 'Início', 'Limite', 'Caução', 'Status']}
          rows={locacoes.map((l) => [<span key="id" className="mono">{l.id}</span>, l.aparelho, dataBR(l.inicio), dataBR(l.limite), brl(l.caucao), <b key="s">{statusLocacao(l)}</b>])}
        />
      )}
    </Modal>
  )
}

function Tabela({ cols, rows }: { cols: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <p className={styles.vazio}>Nenhum registro.</p>
  return (
    <table className={styles.table}>
      <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}
