import type { ReactNode } from 'react'

type Props = { title: string; subtitle?: string; action?: ReactNode }

export function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h1>
        {subtitle && <p className="muted" style={{ marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
