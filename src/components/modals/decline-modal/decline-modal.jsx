import { useModalLogic } from '../../../hooks/useModalLogic'
import styles from './decline-modal.module.css'
import { cerrarSesion, updateUser } from '../../../firebase/utils/user'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Spinner } from 'components/spinner/spinner'

export function DeclineModal({ user, closeModal, closeHabeasDataModal }) {
  useModalLogic({ closeModal })
  const [status, setStatus] = useState(null)

  const handleSubmit = async () => {
    try {
      setStatus('loading')
      await updateUser({
        id: user?.id,
        claim: user?.role,
        update: { active: false },
      })
      await cerrarSesion()
      closeModal()
      closeHabeasDataModal()
      setStatus('success')
      toast.error('Tu cuenta fue desactivada.')
    } catch (error) {
      setStatus('error')
      console.error(error)
    }
  }

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span>Si continuas tu cuenta quedará desactivada.</span>
        <div className={styles.buttons}>
          <button onClick={closeModal}>Cancelar</button>
          <button onClick={handleSubmit}>Continuar</button>
        </div>
        <div className={styles.loading} data-loading={status === 'loading'}>
          {status === 'loading' && (
            <Spinner
              width={30}
              height={30}
              style={{ color: 'var(--azul-profundo)' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
