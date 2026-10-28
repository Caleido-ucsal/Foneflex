import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string }

export function Input({ label, id, ...rest }: Props) {
  return (
    <label className={styles.field} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <input id={id} className={styles.input} {...rest} />
    </label>
  )
}
