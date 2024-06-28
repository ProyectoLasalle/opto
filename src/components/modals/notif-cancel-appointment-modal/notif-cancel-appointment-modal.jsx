import { Link } from 'react-router-dom'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './notif-cancel-appointment-modal.module.css'
import { deleteUserAppointmentNotification } from '../../../firebase/utils/user'
import { useEffect } from 'react'
import { useUser } from '../../../hooks/useUser'

export function NotifCancelAppointmentModal({ date, url, closeModal, id }) {
  const [day, hour] = date.split('T')
  const [year, month, dayOfMonth] = day.split('-')
  const finalDate = `${dayOfMonth}/${month}/${year} a las ${hour}`

  const user = useUser()

  useEffect(() => {
    return () => {
      deleteUserAppointmentNotification({
        userId: user.id,
        role: user.role,
        id,
      }).catch((e) => {
        console.log({ e })
      })
    }
  }, [])

  return (
    <ModalBackground closeModal={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h4>Se ha cancelado una de tus citas</h4>
        <p>Tu cita para el día {finalDate} ha sido cancelada</p>
        <Link className={styles.see} to={url}>
          Ver cita
        </Link>
      </div>
    </ModalBackground>
  )
}
