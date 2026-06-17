import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function HomePage() {
  return (
    <main>
      <h1>Gestão Financeira Pessoal</h1>
      <p>Você está na tela inicial da aplicação.</p>

      <nav>
        <Link to="/login">Login</Link>
        {' | '}
        <Link to="/register">Cadastro</Link>
      </nav>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App