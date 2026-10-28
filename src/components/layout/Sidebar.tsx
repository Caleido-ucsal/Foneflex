import { NavLink } from 'react-router-dom'
import { useAuth } from '../../services/auth'
import { Logo } from './Logo'
import styles from './Sidebar.module.css'

const items = [
  { to: '/', label: 'Visão Geral', icon: '▦' },
  { to: '/ordens-de-servico', label: 'Ordens de Serviço', icon: '🔧' },
  { to: '/vendas', label: 'Vendas de Balcão', icon: '🛒' },
  { to: '/locacoes', label: 'Locação de Aparelhos', icon: '📱' },
  { to: '/clientes', label: 'Base de Clientes', icon: '👤' },
]

export function Sidebar() {
  const { logout } = useAuth()
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}><Logo /></div>
      <span className={styles.menuLabel}>MENU</span>
      <nav className={styles.nav}>
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.to === '/'} className={({ isActive }) => (isActive ? styles.active : '')}>
            <span aria-hidden="true">{i.icon}</span>
            <span className={styles.text}>{i.label}</span>
            <i className={styles.dot} />
          </NavLink>
        ))}
      </nav>
      <button className={styles.logout} onClick={logout}>⇥ SAIR</button>
      <small className={styles.credit}>Desenvolvido por <b>Caleido</b></small>
    </aside>
  )
}
