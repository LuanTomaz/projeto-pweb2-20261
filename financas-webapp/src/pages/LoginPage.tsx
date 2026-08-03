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
      setFormError('Preencha usuário e senha para continuar.')
      return
    }

    if (password.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres.')
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
      <section className="content-panel form-panel">
        <h1>Entrar na conta</h1>
        <p>Use seu usuário e senha para acessar o painel financeiro.</p>
      </section>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            type="text"
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

        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p>
          Ainda não possui conta? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </main>
  )
}

export default LoginPage