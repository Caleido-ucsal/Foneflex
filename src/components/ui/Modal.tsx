import { useEffect, type ReactNode } from 'react'
import styles from './Modal.module.css'

type Props = { title: string; onClose: () => void; children: ReactNode; width?: number }

export function Modal({ title, onClose, children, width = 400 }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">✕</button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
