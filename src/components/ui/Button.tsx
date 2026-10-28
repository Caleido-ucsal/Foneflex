import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'accent'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; block?: boolean }

export function Button({ variant = 'primary', block, className = '', ...rest }: Props) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${block ? styles.block : ''} ${className}`}
      {...rest}
    />
  )
}
