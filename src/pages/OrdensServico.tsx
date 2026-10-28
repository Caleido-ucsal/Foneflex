import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, FilterTabs } from '../components/ui'
import { listarClientes } from '../services/clientes'
import { brl, dataBR } from '../services/mock'
import { ABERTA, STATUS, abrirOrdem, alterarStatus, listarOrdens } from '../services/ordens'
import type { OsStatus } from '../types'
import { NovaOSModal } from './ordens/NovaOSModal'
import styles from './OrdensServico.module.css'

const FILTROS = ['Todos', ...STATUS] as const
type Filtro = (typeof FILTROS)[number]

const classeStatus = (s: OsStatus) => (s === 'Entregue' ? styles.neutro : s === 'Cancelado' ? styles.apagado : styles.ativo)

export default function OrdensServico() {
  const [ordens, setOrdens] = useState(listarOrdens)
  const [clientes, setClientes] = useState(listarClientes)
  const [filtro, setFiltro] = useState<Filtro>('Todos')
  const [params] = useSearchParams()
  const [busca, setBusca] = useState(params.get('q') ?? '')
  const [modal, setModal] = useState(false)

  const cliente = (id: string) => clientes.find((c) => c.id === id)

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return ordens.filter((o) => {
      if (filtro !== 'Todos' && o.status !== filtro) return false
      if (!q) return true
      return [o.id, o.aparelho, cliente(o.clienteId)?.nome ?? ''].some((t) => t.toLowerCase().includes(q))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordens, filtro, busca, clientes])

  return (
    <>
      <PageHeader
        title="Ordens de Serviço"
        subtitle={`${ordens.filter((o) => ABERTA(o.status)).length} abertas · ${ordens.length} total`}
        action={<Button onClick={() => setModal(true)}>＋ Nova OS</Button>}
      />

      <Card className={styles.filtros}>
        <FilterTabs options={FILTROS} value={filtro} onChange={setFiltro} />
        <input placeholder="Buscar OS, cliente, aparelho..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </Card>

      <Card className={styles.table}>
        <table>
          <thead>
            <tr><th>Nº OS</th><th>Data</th><th>Cliente</th><th>Aparelho</th><th>Técnico</th><th>Status</th><th className={styles.right}>Valor total</th><th className={styles.right}>Ações</th></tr>
          </thead>
          <tbody>
            {visiveis.map((o) => {
              const c = cliente(o.clienteId)
              return (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td className={styles.subtle}>{dataBR(o.data)}</td>
                  <td><b>{c?.nome}</b><small className={styles.fone}>{c?.telefone}</small></td>
                  <td>{o.aparelho}</td>
                  <td className="muted">{o.tecnico}</td>
                  <td className={classeStatus(o.status)}>{o.status}</td>
                  <td className={styles.right}><b>{o.valor ? brl(o.valor) : '—'}</b></td>
                  <td className={styles.right}>
                    <select aria-label={`Status da ${o.id}`} value={o.status} onChange={(e) => setOrdens(alterarStatus(o.id, e.target.value as OsStatus))}>
                      {STATUS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
            {visiveis.length === 0 && <tr><td colSpan={8} className={styles.empty}>Nenhuma ordem de serviço encontrada.</td></tr>}
          </tbody>
        </table>
      </Card>

      {modal && (
        <NovaOSModal
          onClose={() => setModal(false)}
          onSave={(dados) => {
            setOrdens(abrirOrdem(dados))
            setClientes(listarClientes())
            setModal(false)
          }}
        />
      )}
    </>
  )
}
