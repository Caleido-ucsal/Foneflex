import { ABERTA, listarOrdens } from './ordens'
import { listarLocacoes, statusLocacao } from './locacoes'
import { brl, hojeISO } from './mock'
import { listarVendas } from './vendas'

/* Caixa do dia = vendas de balcão + diárias de locações iniciadas hoje (a caução é reembolsável e fica fora). */
export function resumoDoDia() {
  const hoje = hojeISO()
  const ordens = listarOrdens()
  const locacoes = listarLocacoes()
  const vendas = listarVendas().filter((v) => v.data === hoje)
  const novasLocacoes = locacoes.filter((l) => l.inicio === hoje)

  const caixa =
    vendas.reduce((t, v) => t + v.total, 0) +
    novasLocacoes.reduce((t, l) => {
      const dias = Math.round((new Date(l.limite).getTime() - new Date(l.inicio).getTime()) / 86400000)
      return t + l.valorDia * dias
    }, 0)

  const abertas = ordens.filter((o) => ABERTA(o.status))
  const prontas = ordens.filter((o) => o.status === 'Pronto para Retirada').length
  const alugados = locacoes.filter((l) => !l.devolvidoEm)
  const atrasados = alugados.filter((l) => statusLocacao(l) === 'Atrasado').length
  const devolucoesHoje = alugados.filter((l) => l.limite === hoje).length

  return [
    { label: 'OS EM ABERTO', value: String(abertas.length), hint: `${prontas} prontas p/ retirada` },
    { label: 'APARELHOS ALUGADOS', value: String(alugados.length), hint: `${atrasados} com devolução em atraso` },
    { label: 'CAIXA DO DIA', value: brl(caixa), hint: `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` },
    { label: 'APARELHOS PARA RETIRADA', value: String(prontas), hint: `${prontas} prontas p/ retirada` },
    { label: 'DEVOLUÇÃO EM ATRASO', value: String(atrasados), hint: `${atrasados} aparelhos constam em atraso da devolução` },
    { label: 'DEVOLUÇÕES HOJE', value: String(devolucoesHoje), hint: 'Pendentes de inspeção' },
  ]
}
