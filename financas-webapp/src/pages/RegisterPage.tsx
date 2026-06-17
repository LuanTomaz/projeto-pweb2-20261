import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { register } from '../features/auth/authSlice'

function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

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

    setFormError('')
    dispatch(register({ name, username, password }))
  }

  return (
    <main>
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="username">Email</label>
          <input
            id="username"
            type="email"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
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