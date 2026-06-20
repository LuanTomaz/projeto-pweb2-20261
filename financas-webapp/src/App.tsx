import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './app/store'
import { logout } from './features/auth/authSlice'
import DashboardPage from './pages/DashboardPage'
import EditTransactionPage from './pages/EditTransactionPage'
import LoginPage from './pages/LoginPage'
import NewTransactionPage from './pages/NewTransactionPage'
import RegisterPage from './pages/RegisterPage'
import TransactionsPage from './pages/TransactionsPage'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'

function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

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
        {user && (
          <div className="user-controls">
            <span className="user-chip">{user.name}</span>
            <button className="logout-button" type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
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
              <DashboardPage />
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
