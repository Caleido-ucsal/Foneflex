import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuth } from '../services/auth'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import OrdensServico from '../pages/OrdensServico'
import Vendas from '../pages/Vendas'
import Locacoes from '../pages/Locacoes'
import Clientes from '../pages/Clientes'

function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ordens-de-servico" element={<OrdensServico />} />
          <Route path="vendas" element={<Vendas />} />
          <Route path="locacoes" element={<Locacoes />} />
          <Route path="clientes" element={<Clientes />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
