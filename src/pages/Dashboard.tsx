import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { brl } from '../services/mock'
import { resumoDoDia } from '../services/resumo'
import { ABERTA, listarOrdens } from '../services/ordens'
import { nomeCliente } from '../services/clientes'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const stats = resumoDoDia()
  return (
    <div className={styles.page}>
      <div className={styles.stats}>
        {stats.map((s) => (
          <Card key={s.label} className={styles.stat}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
            <small>{s.hint}</small>
          </Card>
        ))}
      </div>

      <Card className={styles.table}>
        <header>
          <h2>Últimas Ordens de Serviço</h2>
          <small>Atualizado em tempo real</small>
        </header>
        <table>
          <thead>
            <tr><th>Nº OS</th><th>Cliente</th><th>Aparelho</th><th>Status</th><th className={styles.right}>Valor</th></tr>
          </thead>
          <tbody>
            {listarOrdens().filter((o) => ABERTA(o.status)).slice(0, 7).map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.id}</td>
                <td>{nomeCliente(o.clienteId)}</td>
                <td className="muted">{o.aparelho}</td>
                <td className={styles.status}>{o.status}</td>
                <td className={styles.right}><b>{brl(o.valor)}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className={styles.actions}>
        <Button onClick={() => navigate('/ordens-de-servico')}>＋ Nova OS</Button>
        <Button onClick={() => navigate('/vendas')}>＋ Nova Venda</Button>
        <Button onClick={() => navigate('/locacoes')}>＋ Novo Aluguel</Button>
      </div>
    </div>
  )
}
