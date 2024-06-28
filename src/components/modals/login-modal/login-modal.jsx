import { useEffect, useState } from 'react'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './login-modal.module.css'
import { iniciarSesion } from '../../../firebase/auth'
import { useUser } from '../../../hooks/useUser'
import { cerrarSesion } from '../../../firebase/utils/user'
import { InputWUnderline } from '../../common/input-w-underline/input-w-underline'
import { Spinner } from '../../spinner/spinner'

export function LoginModal({ closeModal }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const user = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    const data = new FormData(e.target)
    const { email, password } = Object.fromEntries(data)

    iniciarSesion(String(email), String(password))
      .then(closeModal)
      .catch((err) => {
        if (
          [
            'auth/invalid-email',
            'auth/wrong-password',
            'auth/user-not-found',
          ].includes(err.code)
        ) {
          setError('Email o contraseña inválidos.')
        } else if (err.code === 'auth/too-many-requests') {
          setError('Demasiados intentos, por favor intenta más tarde.')
        } else setError('Error al iniciar sesión')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (user) {
      if (!user.active) {
        cerrarSesion()
        setError('Tu cuenta está desactivada, no puedes iniciar sesión.')
      }
    }
  }, [user])

  return (
    <ModalBackground closeModal={() => {}}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <img src='/logo.webp' width={200} alt='logo' />
        <h4>Inicia Sesión</h4>
        <div className={styles.inputContainer}>
          <label>Email</label>
          <InputWUnderline id='email' name='email' type='email' autoFocus />
        </div>
        <div className={styles.inputContainer}>
          <label>Contraseña</label>
          <InputWUnderline id='password' name='password' type='password' />
        </div>

        <div className={styles.error}>{error && <span>{error}</span>}</div>

        <button type='submit'>
          {loading ? (
            <Spinner
              style={{
                width: 20,
                height: 20,
                borderColor: 'var(--azul-oscuro)',
                borderBottomColor: 'transparent',
              }}
            />
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </form>
    </ModalBackground>
  )
}
