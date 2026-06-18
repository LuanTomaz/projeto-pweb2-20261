import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './app/store'
import { logout } from './features/auth/authSlice'
import EditTransactionPage from './pages/EditTransactionPage'
import LoginPage from './pages/LoginPage'
import NewTransactionPage from './pages/NewTransactionPage'
import RegisterPage from './pages/RegisterPage'
import TransactionsPage from './pages/TransactionsPage'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'

function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)

  function handleLogout() {
    dispatch(logout())
  }

  return (
    <main>
      <h1>Dashboard Financeiro</h1>

      {user && <p>Olá, {user.name}!</p>}

      <p>Usuário autenticado.</p>

      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </main>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/">
          Financas
        </Link>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/transactions">Transacoes</NavLink>
        </nav>
        {user && <span className="user-chip">{user.name}</span>}
      </header>
      {children}
    </>
  )
}

function PrivatePage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivatePage>
              <HomePage />
            </PrivatePage>
          }
        />

        <Route
          path="/transactions"
          element={
            <PrivatePage>
              <TransactionsPage />
            </PrivatePage>
          }
        />

        <Route
          path="/transactions/new"
          element={
            <PrivatePage>
              <NewTransactionPage />
            </PrivatePage>
          }
        />

        <Route
          path="/transactions/:transactionId/edit"
          element={
            <PrivatePage>
              <EditTransactionPage />
            </PrivatePage>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
