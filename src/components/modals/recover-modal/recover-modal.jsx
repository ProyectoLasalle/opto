import { useState } from 'react'
import styles from './recover-modal.module.css'
import { Spinner } from '../../spinner/spinner'
import { recoverPassword } from '../../../firebase/utils/user'
import { toast } from 'react-toastify'

export function RecoverModal({ closeModal }) {
  const [status, setStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email } = Object.fromEntries(new FormData(e.target))

    setStatus('loading')
    recoverPassword(email)
      .then(() => {
        setStatus('success')
        toast(
          'Se envió un email de recuperación al correo que indicaste, siga las instrucciones indicadas.',
          { autoClose: 8000 },
        )
        setTimeout(closeModal, 3000)
      })
      .catch((err) => {
        const errMessage =
          err instanceof Error
            ? err.message
            : 'Hubo un error, por favor inténtalo más tarde.'
        setStatus({ type: 'error', message: errMessage })
      })
  }

  return (
    <div className={styles.modalBackground} onClick={closeModal}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}>
        <div className={styles.data}>
          <h4>No recuerdas tu contraseña?</h4>
          <span>
            Introduce el email de tu cuenta para mandarte un correo de cambio.
          </span>
        </div>
        <div className={styles.inputContainer}>
          <input
            autoFocus
            type='email'
            placeholder='Introduce tu email...'
            id='email'
            name='email'
          />
          <div className={styles.after} />
        </div>
        <button
          type='submit'
          disabled={status === 'loading' || status === 'success'}>
          {status === 'loading' ? (
            <Spinner
              style={{
                color: 'black',
                borderWidth: 2,
                width: 10,
                height: 10,
              }}
            />
          ) : (
            'Enviar'
          )}
        </button>
        <div className={styles.errorContainer}>
          {status?.type === 'error' && <span>{status.message}</span>}
        </div>
      </form>
    </div>
  )
}
