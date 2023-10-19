import { useCallback, useEffect } from 'react'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './habeas-data-modal.module.css'
import { deleteUserAppointmentNotification } from '../../../firebase/utils/user'
import { useUser } from '../../../hooks/useUser'

export function HabeasDataModal({ closeModal, id }) {
  useEffect(() => {
    if (!document) return
    const nav = document.querySelector('nav')

    nav.style.pointerEvents = 'none'

    return () => {
      nav.style.pointerEvents = 'auto'
    }
  }, [])

  const user = useUser()

  const handleAccept = useCallback(() => {
    deleteUserAppointmentNotification({
      userId: user.id,
      role: user.role,
      id,
    }).then(closeModal)
  }, [user])

  return (
    <ModalBackground closeModal={() => {}} onClick={() => {}}>
      <div className={styles.modal}>
        <h4>Lorem Ipsum</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit beatae
          saepe architecto, omnis dignissimos quae itaque iste illo deserunt
          sequi soluta molestias cupiditate accusantium quam corporis ab
          repellendus! Iste, qui. Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. In quia doloremque rerum fuga qui minus nemo earum
          laborum asperiores mollitia at, temporibus itaque possimus illum
          similique eum distinctio cupiditate saepe.
        </p>

        <button onClick={handleAccept} className={styles.submit}>
          Aceptar
        </button>
      </div>
    </ModalBackground>
  )
}
