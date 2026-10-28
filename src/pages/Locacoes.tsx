import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, FilterTabs } from '../components/ui'
import { listarClientes } from '../services/clientes'
import { criarLocacao, diasAtraso, disponiveis, listarLocacoes, registrarDevolucao, statusLocacao } from '../services/locacoes'
import { brl, dataBR } from '../services/mock'
import type { Locacao } from '../types'
import { DevolucaoModal } from './locacoes/DevolucaoModal'
import { NovoAluguelModal } from './locacoes/NovoAluguelModal'
import styles from './Locacoes.module.css'

const FILTROS = ['Todos', 'Ativo', 'Atrasado', 'Devolvido'] as const
type Filtro = (typeof FILTROS)[number]

export default function Locacoes() {
  const [locacoes, setLocacoes] = useState(listarLocacoes)
  const [clientes, setClientes] = useState(listarClientes)
  const [filtro, setFiltro] = useState<Filtro>('Todos')
  const [novo, setNovo] = useState(false)
  const [devolvendo, setDevolvendo] = useState<Locacao | null>(null)

  const cliente = (id: string) => clientes.find((c) => c.id === id)
  const visiveis = useMemo(
    () => locacoes.filter((l) => filtro === 'Todos' || statusLocacao(l) === filtro),
    [locacoes, filtro],
  )
  const ativos = locacoes.filter((l) => !l.devolvidoEm).length
  const livres = disponiveis(locacoes)

  return (
    <>
      <PageHeader
        title="Locação de Aparelhos"
        subtitle={`${ativos} ativos · ${livres.length} disponíveis para aluguel`}
        action={<Button variant="accent" onClick={() => setNovo(true)}>＋ Novo Aluguel</Button>}
      />

      <Card className={styles.filtros}><FilterTabs options={FILTROS} value={filtro} onChange={setFiltro} /></Card>

      <Card className={styles.table}>
        <table>
          <thead>
            <tr><th>Locação</th><th>Cliente</th><th>Aparelho</th><th>Data de início</th><th>Período</th><th>Data limite</th><th>Caução</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {visiveis.map((l) => {
              const st = statusLocacao(l)
              const c = cliente(l.clienteId)
              return (
                <tr key={l.id}>
                  <td className="mono">{l.id}</td>
                  <td><b>{c?.nome}</b><small>{c?.telefone}</small></td>
                  <td>{l.aparelho}<small className="mono">{l.imei.slice(0, 8)}...</small></td>
                  <td>{dataBR(l.inicio)}</td>
                  <td className="muted">{brl(l.valorDia)}/dia</td>
                  <td className={st === 'Atrasado' ? styles.atraso : ''}>
                    <b>{dataBR(l.limite)}</b>
                    {st === 'Atrasado' && <small>+{diasAtraso(l)} dias em atraso</small>}
                  </td>
                  <td><b>{brl(l.caucao)}</b></td>
                  <td className={styles[st]}>{st}</td>
                  <td className={styles.right}>
                    {l.devolvidoEm ? (
                      <small>Devolvido em {dataBR(l.devolvidoEm)}</small>
                    ) : (
                      <Button onClick={() => setDevolvendo(l)}>Registrar Devolução</Button>
                    )}
                  </td>
                </tr>
              )
            })}
            {visiveis.length === 0 && <tr><td colSpan={9} className={styles.empty}>Nenhuma locação encontrada.</td></tr>}
          </tbody>
        </table>
      </Card>

      {novo && (
        <NovoAluguelModal
          disponiveis={livres}
          onClose={() => setNovo(false)}
          onSave={(dados) => {
            setLocacoes(criarLocacao(dados))
            setClientes(listarClientes())
            setNovo(false)
          }}
        />
      )}
      {devolvendo && (
        <DevolucaoModal
          locacao={devolvendo}
          cliente={cliente(devolvendo.clienteId)?.nome ?? '—'}
          onClose={() => setDevolvendo(null)}
          onConfirm={(condicao) => {
            setLocacoes(registrarDevolucao(devolvendo.id, condicao))
            setDevolvendo(null)
          }}
        />
      )}
    </>
  )
}
