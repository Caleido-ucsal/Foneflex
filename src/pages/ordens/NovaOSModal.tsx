import { useState } from 'react'
import { Button, Input, Modal, Stepper } from '../../components/ui'
import { acharPorCpf, cadastrarCliente } from '../../services/clientes'
import { cpfValido, maskCpf, maskTelefone, telefoneValido } from '../../services/masks'
import { brl } from '../../services/mock'
import { TECNICOS, type NovaOS } from '../../services/ordens'

const PASSOS = ['Cliente', 'Dispositivo', 'Diagnóstico', 'Confirmação']

type Props = { onClose: () => void; onSave: (dados: NovaOS) => void }

export function NovaOSModal({ onClose, onSave }: Props) {
  const [passo, setPasso] = useState(0)
  const [cpf, setCpf] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [aparelho, setAparelho] = useState('')
  const [imei, setImei] = useState('')
  const [defeito, setDefeito] = useState('')
  const [tecnico, setTecnico] = useState(TECNICOS[0])
  const [valor, setValor] = useState('')

  const onCpf = (v: string) => {
    const masked = maskCpf(v)
    setCpf(masked)
    const existente = acharPorCpf(masked)
    if (existente) {
      setNome(existente.nome)
      setTelefone(existente.telefone)
    }
  }

  const valorNum = Number(valor.replace(',', '.')) || 0
  const podeAvancar = [
    nome.trim().length > 2 && cpfValido(cpf) && telefoneValido(telefone),
    aparelho.trim().length > 1,
    defeito.trim().length > 2,
    true,
  ][passo]

  const confirmar = () => {
    const cliente = acharPorCpf(cpf) ?? cadastrarCliente({ nome: nome.trim(), cpf, telefone, email: '' }).find((c) => c.cpf === cpf)!
    onSave({
      clienteId: cliente.id,
      aparelho: imei ? `${aparelho.trim()} (IMEI ${imei})` : aparelho.trim(),
      defeito: defeito.trim(),
      tecnico,
      valor: valorNum,
    })
  }

  return (
    <Modal title="Abrir Nova Ordem de Serviço" onClose={onClose} width={795}>
      <Stepper steps={PASSOS} current={passo} />

      {passo === 0 && (
        <Secao titulo="Dados do cliente">
          <Input label="CPF *" placeholder="000.000.000-00" value={cpf} onChange={(e) => onCpf(e.target.value)} />
          <Input label="Nome Completo *" placeholder="Nome do cliente" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input label="Telefone *" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(maskTelefone(e.target.value))} />
          {acharPorCpf(cpf) && <small style={{ gridColumn: '1 / -1', color: 'var(--success)' }}>Cliente já cadastrado — dados preenchidos.</small>}
        </Secao>
      )}
      {passo === 1 && (
        <Secao titulo="Dados do dispositivo">
          <Input label="Marca / Modelo *" placeholder="Ex.: Samsung Galaxy A54" value={aparelho} onChange={(e) => setAparelho(e.target.value)} />
          <Input label="IMEI (opcional)" placeholder="000000000000000" value={imei} onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))} />
        </Secao>
      )}
      {passo === 2 && (
        <Secao titulo="Diagnóstico">
          <Input label="Defeito relatado *" placeholder="Descreva o problema" value={defeito} onChange={(e) => setDefeito(e.target.value)} />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--navy-700)' }}>
            Técnico responsável
            <select value={tecnico} onChange={(e) => setTecnico(e.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface-muted)' }}>
              {TECNICOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <Input label="Valor do orçamento (R$)" inputMode="decimal" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
        </Secao>
      )}
      {passo === 3 && (
        <Secao titulo="Confirme os dados">
          <Resumo itens={[['Cliente', nome], ['CPF', cpf], ['Telefone', telefone], ['Aparelho', aparelho], ['Defeito', defeito], ['Técnico', tecnico], ['Orçamento', brl(valorNum)]]} />
        </Secao>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 20 }}>
        <Button variant="secondary" onClick={passo === 0 ? onClose : () => setPasso(passo - 1)}>{passo === 0 ? 'Cancelar' : '← Voltar'}</Button>
        {passo < 3 ? (
          <Button disabled={!podeAvancar} onClick={() => setPasso(passo + 1)}>Próximo →</Button>
        ) : (
          <Button variant="accent" onClick={confirmar}>Abrir OS</Button>
        )}
      </div>
    </Modal>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: 11, color: 'var(--navy-700)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>{titulo}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
    </div>
  )
}

function Resumo({ itens }: { itens: [string, string][] }) {
  return (
    <dl style={{ gridColumn: '1 / -1', margin: 0, background: 'var(--surface-muted)', borderRadius: 8, padding: 16, display: 'grid', gap: 8 }}>
      {itens.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <dt className="muted">{k}</dt>
          <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

