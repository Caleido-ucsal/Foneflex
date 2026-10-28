import { useState } from 'react'
import { Button, Modal } from '../../components/ui'
import { diasAtraso } from '../../services/locacoes'
import { brl } from '../../services/mock'
import type { Locacao } from '../../types'

type Props = { locacao: Locacao; cliente: string; onClose: () => void; onConfirm: (condicao: string) => void }

export function DevolucaoModal({ locacao, cliente, onClose, onConfirm }: Props) {
  const [condicao, setCondicao] = useState('')
  const atraso = diasAtraso(locacao)
  const linhas: [string, string][] = [
    ['Cliente', cliente],
    ['Aparelho', locacao.aparelho],
    ['Valor da Locação', brl(locacao.valorDia)],
    ['Caução Retido', brl(locacao.caucao)],
  ]

  return (
    <Modal title={`Devolução — ${locacao.id}`} onClose={onClose}>
      <div style={{ background: 'var(--surface-muted)', borderRadius: 8, padding: 14, display: 'grid', gap: 6 }}>
        {linhas.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="muted">{k}</span><b>{v}</b>
          </div>
        ))}
        {atraso > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            <span>Dias em atraso</span><b>+{atraso} dias</b>
          </div>
        )}
      </div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--navy-700)', margin: '16px 0' }}>
        Condição do Aparelho na Devolução
        <textarea
          rows={3}
          placeholder="Descreva o estado físico do aparelho..."
          value={condicao}
          onChange={(e) => setCondicao(e.target.value)}
          style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 10, resize: 'vertical' }}
        />
      </label>

      <p style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid #a7f3d0', borderRadius: 8, padding: '10px 12px', fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
        ✓ Ao confirmar, o caução será marcado como Liberado
      </p>
      <Button block disabled={condicao.trim().length < 3} onClick={() => onConfirm(condicao.trim())}>
        Confirmar Devolução e Liberar Caução
      </Button>
    </Modal>
  )
}
