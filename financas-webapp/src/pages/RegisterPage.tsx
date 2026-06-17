import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
      setFormError('Preencha nome, email e senha.')
      return
    }

    if (name.trim().length < 3) {
      setFormError('O nome deve possuir pelo menos 3 caracteres.')
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
    dispatch(register({ name, username, password }))
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <main>
      <h1>Cadastro</h1>

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
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {(formError || error) && <p>{formError || error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </main>
  )
}

export default RegisterPage