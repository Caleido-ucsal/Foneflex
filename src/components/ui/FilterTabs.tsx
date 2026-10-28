import styles from './FilterTabs.module.css'

type Props<T extends string> = { options: readonly T[]; value: T; onChange: (v: T) => void }

export function FilterTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className={styles.tabs}>
      {options.map((o) => (
        <button key={o} className={o === value ? styles.active : ''} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  )
}
