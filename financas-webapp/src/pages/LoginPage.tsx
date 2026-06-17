import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { login } from '../features/auth/authSlice'

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth,
  )

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setFormError('Preencha email e senha.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(username)) {
      setFormError('Informe um email válido.')
      return
    }

    if (password.length < 6) {
      setFormError('A senha deve possuir pelo menos 6 caracteres.')
      return
    }

    setFormError('')
    dispatch(login({ username, password }))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Email</label>
          <input
            id="username"
            type="email"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {(formError || error) && <p>{formError || error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p>
          Não possui conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </form>
    </main>
  )
}

export default LoginPage