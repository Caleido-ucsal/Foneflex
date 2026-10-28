import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { pathname } = useLocation()
  // O menu mobile fica atrelado à rota em que foi aberto: ao navegar, fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const menuAberto = abertoEm === pathname

  return (
    <div className={menuAberto ? 'aberto' : ''}>
      <Sidebar />
      {menuAberto && <div className={styles.fundo} onClick={() => setAbertoEm(null)} />}
      <div className={styles.conteudo}>
        <Topbar onMenu={() => setAbertoEm(pathname)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
