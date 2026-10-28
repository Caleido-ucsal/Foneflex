import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { Logo } from '../components/layout/Logo'
import { useAuth } from '../services/auth'
import styles from './Login.module.css'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  if (user) return <Navigate to="/" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (login(email, senha)) navigate('/')
    else setErro('Informe e-mail/login e senha.')
  }

  return (
    <div className={styles.page}>
      <section className={styles.left}>
        <Logo dark size={64} />
        <h1>Inicie sessão</h1>
        <p>Entre com suas credenciais para acessar o sistema</p>
      </section>
      <section className={styles.right}>
        <form onSubmit={onSubmit} className={styles.form}>
          <Input id="email" placeholder="E-mail/login" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div>
            <Input id="senha" type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <a href="#" className={styles.forgot}>Esqueceu sua senha?</a>
          </div>
          {erro && <p className={styles.erro}>{erro}</p>}
          <Button variant="accent" type="submit" block>Entrar</Button>
        </form>
        <footer>Desenvolvido por <b>Caleido</b></footer>
      </section>
    </div>
  )
}
