import { useEffect, useState } from 'react'
import { iniciarSesion, sendVerificationCode } from '../../firebase/auth'
import styles from './login.module.css'
import { Spinner } from '../../components/spinner/spinner'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { cerrarSesion, verifyUserCredentials } from '../../firebase/utils/user'
import { useModal } from '../../hooks/useModal'
import { RecoverModal } from '../../components/modals/recover-modal/recover-modal'
import { toast } from 'react-toastify'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [userVerified, setUserVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const user = useUser()
  const { openModal, closeModal, isOpen } = useModal()
  const navigate = useNavigate()

  const handleVerificationCode = async (e) => {
    e.preventDefault()
    try {
      setError(false)
      setLoading(true)
      const res =
        !userVerified && (await verifyUserCredentials(email, password))

      if (res?.idToken || userVerified) {
        setUserVerified(true)
        const { idToken, displayName, localId } = res
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        await sendVerificationCode({
          email,
          code,
          idToken,
          displayName,
          localId,
        })
        setGeneratedCode(code)
        toast.success('Revisa tu correo electrónico.')
      } else {
        setError('Email o contraseña inválidos.')
      }
    } catch (error) {
      console.log(error)
      setError('Ocurrió un error en el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const VerifyCode = async (e) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    if (verificationCode === generatedCode) {
      iniciarSesion(String(email), String(password))
        .catch((err) => {
          console.log(err)
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
    } else {
      setLoading(false)
      setError('Código no válido.')
    }
  }

  useEffect(() => {
    if (user) {
      if (!user.active) {
        cerrarSesion()
        setError('Tu cuenta está desactivada, no puedes iniciar sesión.')
      } else {
        navigate('/')
      }
    }
  }, [user])

  const subtitle = generatedCode
    ? 'Introduce el código de 6 digitos que enviamos a tu correo'
    : 'Introduce tus datos de inicio de sesión'

  const onSubmit = generatedCode ? VerifyCode : handleVerificationCode

  return (
    <>
      <main className={styles.main}>
        <section className={styles.sectionForm}>
          <form onSubmit={onSubmit}>
            <h1>Inicia Sesión</h1>
            <p>{subtitle}</p>
            <div className={styles.inputs}>
              <div>
                {!generatedCode ? (
                  <>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoFocus
                      placeholder='Email...'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      id='password'
                      name='password'
                      type='password'
                      placeholder='Contraseña...'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </>
                ) : (
                  <input
                    id='verificationCode'
                    name='verificationCode'
                    type='text'
                    autoFocus
                    placeholder='Código de verificación...'
                    maxLength='6'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                )}
              </div>
            </div>
            <div className={styles.error}>{error && <span>{error}</span>}</div>
            {!generatedCode ? (
              <>
                <button
                  className={styles.recover}
                  type='button'
                  onClick={openModal}>
                  No recuerdas tu contraseña?
                </button>
                <button className={styles.submit}>
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
              </>
            ) : (
              <>
                {error === 'Código no válido.' ? (
                  <button
                    className={styles.recover}
                    type='button'
                    onClick={handleVerificationCode}>
                    Reenviar código
                  </button>
                ) : null}
                <button className={styles.submit} type='submit'>
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
                    'Verificar'
                  )}
                </button>
              </>
            )}
          </form>
        </section>
        <section className={styles.sectionLogo}>
          <img src='/logo.webp' width={400} height={74} />
        </section>
      </main>
      {isOpen && <RecoverModal closeModal={closeModal} />}
    </>
  )
}
