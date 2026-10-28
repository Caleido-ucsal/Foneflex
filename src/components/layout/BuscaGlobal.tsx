import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarClientes } from '../../services/clientes'
import { listarOrdens } from '../../services/ordens'
import styles from './BuscaGlobal.module.css'

type Resultado = { chave: string; titulo: string; detalhe: string; destino: string }

export function BuscaGlobal() {
  const [q, setQ] = useState('')
  const [aberto, setAberto] = useState(false)
  const navigate = useNavigate()

  const resultados = useMemo<Resultado[]>(() => {
    const termo = q.trim().toLowerCase()
    if (termo.length < 2) return []
    const dig = termo.replace(/\D/g, '')
    const clientes = listarClientes().filter(
      (c) => c.nome.toLowerCase().includes(termo) || (dig && (c.cpf.replace(/\D/g, '').includes(dig) || c.telefone.replace(/\D/g, '').includes(dig))),
    )
    const nomeDe = (id: string) => listarClientes().find((c) => c.id === id)?.nome ?? ''
    const ordens = listarOrdens().filter(
      (o) => o.id.toLowerCase().includes(termo) || o.aparelho.toLowerCase().includes(termo) || nomeDe(o.clienteId).toLowerCase().includes(termo),
    )
    return [
      ...clientes.slice(0, 4).map((c) => ({ chave: c.id, titulo: c.nome, detalhe: `Cliente · ${c.cpf}`, destino: `/clientes?q=${encodeURIComponent(c.nome)}` })),
      ...ordens.slice(0, 4).map((o) => ({ chave: o.id, titulo: `${o.id} · ${o.aparelho}`, detalhe: `Ordem de serviço · ${o.status}`, destino: `/ordens-de-servico?q=${encodeURIComponent(o.id)}` })),
    ]
  }, [q])

  const ir = (destino: string) => {
    navigate(destino)
    setQ('')
    setAberto(false)
  }

  return (
    <div className={styles.wrap}>
      <input
        placeholder="Buscar por CPF, nome ou Nº OS..."
        aria-label="Busca global"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setAberto(true)
        }}
        onFocus={() => setAberto(true)}
        onBlur={() => setTimeout(() => setAberto(false), 150)}
        onKeyDown={(e) => e.key === 'Enter' && resultados[0] && ir(resultados[0].destino)}
      />
      {aberto && q.trim().length >= 2 && (
        <ul className={styles.lista} role="listbox">
          {resultados.length === 0 && <li className={styles.vazio}>Nada encontrado.</li>}
          {resultados.map((r) => (
            <li key={r.chave} role="option" aria-selected={false}>
              <button onMouseDown={() => ir(r.destino)}>
                <strong>{r.titulo}</strong>
                <small>{r.detalhe}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
