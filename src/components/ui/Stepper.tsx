import styles from './Stepper.module.css'

type Props = { steps: string[]; current: number }

export function Stepper({ steps, current }: Props) {
  return (
    <ol className={styles.stepper}>
      {steps.map((label, i) => (
        <li key={label} className={i <= current ? styles.on : ''} aria-current={i === current ? 'step' : undefined}>
          <span>{i + 1}</span>
          <small>{label}</small>
        </li>
      ))}
    </ol>
  )
}
