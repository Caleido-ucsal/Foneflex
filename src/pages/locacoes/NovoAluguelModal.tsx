import { useState } from 'react'
import { Button, Input, Modal, Stepper } from '../../components/ui'
import { acharPorCpf, cadastrarCliente } from '../../services/clientes'
import type { NovaLocacao } from '../../services/locacoes'
import { cpfValido, maskCpf, maskTelefone, telefoneValido } from '../../services/masks'
import { brl, dataBR, hojeISO, somarDias } from '../../services/mock'
import { FORMAS } from '../../services/vendas'
import type { FormaPagamento } from '../../types'

const PASSOS = ['Seleção', 'Garantia / Caução', 'Termo & Entrega']

type Aparelho = { nome: string; valorDia: number; caucao: number }
type Props = { disponiveis: Aparelho[]; onClose: () => void; onSave: (dados: NovaLocacao) => void }

export function NovoAluguelModal({ disponiveis, onClose, onSave }: Props) {
  const [passo, setPasso] = useState(0)
  const [aparelho, setAparelho] = useState<Aparelho | null>(null)
  const [dias, setDias] = useState(7)
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [imei, setImei] = useState('')
  const [caucao, setCaucao] = useState('')
  const [pagamento, setPagamento] = useState<FormaPagamento>('PIX')
  const [aceitaTermo, setAceitaTermo] = useState(false)
  const [caucaoRecebido, setCaucaoRecebido] = useState(false)

  const inicio = hojeISO()
  const limite = somarDias(inicio, dias)
  const caucaoNum = caucao === '' ? (aparelho?.caucao ?? 0) : Number(caucao.replace(',', '.')) || 0
  const totalLocacao = (aparelho?.valorDia ?? 0) * dias

  const onCpf = (v: string) => {
    const m = maskCpf(v)
    setCpf(m)
    const c = acharPorCpf(m)
    if (c) {
      setNome(c.nome)
      setTelefone(c.telefone)
    }
  }

  const podeAvancar = [
    !!aparelho && dias >= 1 && nome.trim().length > 2 && cpfValido(cpf) && telefoneValido(telefone),
    caucaoNum > 0 && imei.length >= 15,
    aceitaTermo && caucaoRecebido,
  ][passo]

  const confirmar = () => {
    if (!aparelho) return
    const c = acharPorCpf(cpf) ?? cadastrarCliente({ nome: nome.trim(), cpf, telefone, email: '' }).find((x) => x.cpf === cpf)!
    onSave({ clienteId: c.id, aparelho: aparelho.nome, imei, inicio, limite, valorDia: aparelho.valorDia, caucao: caucaoNum, pagamentoCaucao: pagamento })
  }

  return (
    <Modal title="Novo Contrato de Locação" onClose={onClose} width={795}>
      <Stepper steps={PASSOS} current={passo} />

      {passo === 0 && (
        <>
          <Titulo>Selecione o aparelho e período</Titulo>
          <span style={rotulo}>Aparelhos Disponíveis</span>
          {disponiveis.length === 0 && <p className="muted">Nenhum aparelho disponível no momento.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '6px 0 16px' }}>
            {disponiveis.map((a) => (
              <button
                key={a.nome}
                onClick={() => setAparelho(a)}
                aria-pressed={aparelho?.nome === a.nome}
                style={{ ...cartao, outline: aparelho?.nome === a.nome ? '2px solid var(--teal-600)' : 'none' }}
              >
                <span aria-hidden="true">📱</span>
                <span><strong>{a.nome}</strong><br /><b style={{ fontSize: 11 }}>{brl(a.valorDia)}/dia</b></span>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <Input label="Período (dias)" type="number" min={1} max={90} value={dias} onChange={(e) => setDias(Math.max(1, Number(e.target.value) || 1))} />
            <Input label="Data de Início" value={dataBR(inicio)} readOnly />
            <Input label="Data de Devolução" value={dataBR(limite)} readOnly />
            <Input label="Nome do Cliente *" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Input label="CPF *" placeholder="000.000.000-00" value={cpf} onChange={(e) => onCpf(e.target.value)} />
            <Input label="Telefone *" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(maskTelefone(e.target.value))} />
          </div>
        </>
      )}

      {passo === 1 && (
        <>
          <Titulo>Garantia e caução</Titulo>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="IMEI do aparelho entregue *" placeholder="15 dígitos" value={imei} onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))} />
            <Input label="Valor da caução (R$) *" inputMode="decimal" placeholder={String(aparelho?.caucao ?? '')} value={caucao} onChange={(e) => setCaucao(e.target.value)} />
          </div>
          <span style={{ ...rotulo, marginTop: 16 }}>Forma de pagamento da caução</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {FORMAS.map((f) => (
              <button key={f} onClick={() => setPagamento(f)} style={{ ...chip, ...(f === pagamento ? chipOn : {}) }}>{f}</button>
            ))}
          </div>
          <Resumo itens={[['Aparelho', aparelho?.nome ?? ''], ['Locação', `${dias} dia(s) × ${brl(aparelho?.valorDia ?? 0)} = ${brl(totalLocacao)}`], ['Caução (reembolsável)', brl(caucaoNum)], ['Total a receber agora', brl(totalLocacao + caucaoNum)]]} />
        </>
      )}

      {passo === 2 && (
        <>
          <Titulo>Termo de responsabilidade e entrega</Titulo>
          <div style={{ background: 'var(--surface-muted)', borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6, maxHeight: 150, overflow: 'auto' }}>
            Eu, <b>{nome}</b> (CPF {cpf}), declaro receber o aparelho <b>{aparelho?.nome}</b> (IMEI {imei}) em perfeito estado, comprometo-me a devolvê-lo até <b>{dataBR(limite)}</b> e responsabilizo-me por perda, roubo ou dano. Em caso de atraso, serão cobradas diárias adicionais; em caso de não devolução, a caução de <b>{brl(caucaoNum)}</b> será retida.
          </div>
          <label style={check}><input type="checkbox" checked={aceitaTermo} onChange={(e) => setAceitaTermo(e.target.checked)} /> Cliente leu e aceita o termo de responsabilidade</label>
          <label style={check}><input type="checkbox" checked={caucaoRecebido} onChange={(e) => setCaucaoRecebido(e.target.checked)} /> Caução de {brl(caucaoNum)} recebida ({pagamento})</label>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 20 }}>
        <Button variant="secondary" onClick={passo === 0 ? onClose : () => setPasso(passo - 1)}>{passo === 0 ? 'Cancelar' : '← Voltar'}</Button>
        {passo < 2 ? (
          <Button disabled={!podeAvancar} onClick={() => setPasso(passo + 1)}>Próximo →</Button>
        ) : (
          <Button variant="accent" disabled={!podeAvancar} onClick={confirmar}>Confirmar Locação e Entregar</Button>
        )}
      </div>
    </Modal>
  )
}

const rotulo = { fontSize: 12, color: 'var(--navy-700)', display: 'block' } as const
const cartao = { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'left' } as const
const chip = { background: '#fff', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 14px', fontSize: 12 } as const
const chipOn = { background: 'var(--navy-900)', color: '#fff', borderColor: 'var(--navy-900)' } as const
const check = { display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13 } as const

function Titulo({ children }: { children: string }) {
  return <h3 style={{ fontSize: 11, color: 'var(--navy-700)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>{children}</h3>
}

function Resumo({ itens }: { itens: [string, string][] }) {
  return (
    <dl style={{ margin: '18px 0 0', background: 'var(--surface-muted)', borderRadius: 8, padding: 14, display: 'grid', gap: 8 }}>
      {itens.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <dt className="muted">{k}</dt><dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
