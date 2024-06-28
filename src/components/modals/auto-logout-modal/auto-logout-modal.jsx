import { useEffect } from 'react'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './auto-logout-modal.module.css'
import { useRef } from 'react'
import { cerrarSesion } from '../../../firebase/utils/user'

export function AutoLogoutModal({ closeModal }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      cerrarSesion().then(closeModal)
    }, 1000 * 60 * 5)

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <ModalBackground closeModal={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Estas ahí?</h3>
        <p>Si no te mueves cerraremos tu sesión automáticamente.</p>

        <div className={styles.buttonsContainer}>
          <button
            onClick={() => {
              cerrarSesion().then(closeModal)
            }}>
            Cerrar Sesión
          </button>
          <button onClick={closeModal}>Cancelar</button>
        </div>
      </div>
    </ModalBackground>
  )
}
