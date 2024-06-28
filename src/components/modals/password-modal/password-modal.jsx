import { useEffect, useRef, useState } from 'react'
import styles from './password-modal.module.css'
import { Spinner } from '../../spinner/spinner'
import { API_ADMIN_URL } from '../../../utils/prod-dev-variables'
import { auth } from '../../../firebase/config'
import { toast } from 'react-toastify'
import { useModalLogic } from '../../../hooks/useModalLogic'

export function PasswordModal({ closeModal, id, closeAtEnd }) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [validationError, setValidationError] = useState({
    error: true,
    text: '',
  })
  const [status, setStatus] = useState(null)
  const hasConfirmationChanged = useRef(false)

  useModalLogic({ closeModal })

  useEffect(() => {
    if (confirmation !== '' && hasConfirmationChanged !== true)
      hasConfirmationChanged.current = true

    if (password === '' && confirmation === '') {
      setValidationError({
        error: true,
        text: '',
      })
      return
    }

    if (password.length < 7) {
      setValidationError({
        error: true,
        text: 'La contraseña debe tener como mínimo 6 caracteres.',
      })
      return
    }
    if (password !== confirmation && hasConfirmationChanged.current) {
      setValidationError({
        error: true,
        text: 'La contraseña y la confirmación deben ser iguales.',
      })
      return
    }
    if (!hasConfirmationChanged.current) {
      setValidationError({
        error: true,
        text: '',
      })
      return
    }

    setValidationError({
      error: false,
    })
  }, [password, confirmation])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    const token = await auth.currentUser.getIdToken(true)

    fetch(API_ADMIN_URL, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ password, userToModify: id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('')
        setStatus('success')
        toast('La contraseña se cambió correctamente')
        closeAtEnd &&
          setTimeout(() => {
            closeModal()
          }, 2500)
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return (
    <div
      id='modalBackground'
      className={styles.modalBackground}
      onClick={closeModal}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}>
        <img className={styles.logo} src='/logo.webp' height={35} />
        <span>Cambia la contraseña.</span>
        <div className={styles.inputContainer}>
          <label htmlFor='password'>Contraseña</label>
          <div className={styles.inputParent}>
            <input
              id='password'
              autoFocus
              style={{
                borderColor:
                  validationError.text !== '' && validationError.error
                    ? 'rgb(235 52 52)'
                    : 'transparent',
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.inputBrother} />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor='confirm'>Confirmar Contraseña</label>
          <div className={styles.inputParent}>
            <input
              style={{
                borderColor:
                  validationError.text !== '' && validationError.error
                    ? 'rgb(235 52 52)'
                    : 'transparent',
              }}
              id='confirm'
              onChange={(e) => setConfirmation(e.target.value)}
            />
            <div className={styles.inputBrother} />
          </div>
        </div>

        <div className={styles.validationContainer}>
          {validationError && <span>{validationError.text}</span>}
        </div>

        <button
          disabled={validationError.error}
          data-success={status === 'success'}
          data-error={status === 'error'}
          className={styles.send}>
          {status === null ? (
            'Enviar'
          ) : status === 'loading' ? (
            <Spinner style={{ height: 10, width: 10, borderWidth: 2 }} />
          ) : status === 'error' ? (
            'Error al cambiar la contraseña'
          ) : (
            'Contraseña cambiada'
          )}
        </button>
      </form>
    </div>
  )
}
