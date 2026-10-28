import { useEffect, useState } from 'react'
import { useAuth } from '../../services/auth'
import { BuscaGlobal } from './BuscaGlobal'
import styles from './Topbar.module.css'

const formatDate = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className={styles.topbar}>
      <button className={styles.menu} onClick={onMenu} aria-label="Abrir menu">☰</button>
      <BuscaGlobal />
      <div className={styles.clock}>
        <strong>{now.toLocaleTimeString('pt-BR')}</strong>
        <span>{formatDate(now)}</span>
      </div>
      <div className={styles.user}>
        <div className={styles.avatar}>{user?.initials}</div>
        <div>
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>
      </div>
    </header>
  )
}
