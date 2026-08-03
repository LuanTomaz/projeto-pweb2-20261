import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { register } from '../features/auth/authSlice'

function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth,
  )

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    if (!name.trim() || !username.trim() || !password.trim()) {
      setFormError('Preencha nome, usuário e senha para continuar.')
      return
    }

    if (name.trim().length < 3) {
      setFormError('O nome deve ter pelo menos 3 caracteres.')
      return
    }

    if (password.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setFormError('')
    dispatch(register({ name, username, password }))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <main>
      <section className="content-panel form-panel">
        <h1>Criar conta</h1>
        <p>Cadastre-se para organizar receitas, despesas e limites por categoria.</p>
      </section>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            required
            minLength={3}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {(formError || error) && <p>{formError || error}</p>}

        <button className="primary-action" type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <p>
          Já possui conta? <Link to="/login">Fazer login</Link>
        </p>
      </form>
    </main>
  )
}

export default RegisterPage