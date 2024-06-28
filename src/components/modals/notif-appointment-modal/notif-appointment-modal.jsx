import { useEffect, useMemo } from 'react'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './notif-appointment-modal.module.css'
import { useUser } from '../../../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { deleteUserAppointmentNotification } from '../../../firebase/utils/user'

const ModalRender = ({ role, profesional, parsedDate, isPostponement }) => {
  if (role === 'patient')
    return (
      <>
        <p>Tu profesional asignado</p>
        {profesional && (
          <p className={styles.doctor}>
            {profesional.nombre} {profesional.apellido}
          </p>
        )}
        <p>
          {isPostponement ? 'ha reprogramado una cita' : 'te ha citado'} para el
          día
        </p>
        <p className={styles.date}>{parsedDate}</p>

        <p className={styles.confirmP}>
          Esta cita tiene que ser confirmada por tu parte, también puedes
          cancelarla dando un motivo, puedes hacerlo accediendo a la cita.
        </p>
      </>
    )

  return (
    <>
      <p>
        {isPostponement
          ? 'Se ha reprogramado una de tus citas'
          : 'Se te ha citado'}{' '}
        para el día
      </p>
      <p className={styles.date}>{parsedDate}</p>
    </>
  )
}

export function NotifAppointmentModal({
  date: rawDate,
  closeModal,
  url,
  isPostponement,
  id,
}) {
  const user = useUser()
  const profesional = user.medico_asignado

  const parsedDate = useMemo(() => {
    if (!rawDate) return ''
    const [date, time] = rawDate.split('T')

    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year} a las ${time}hs`
  }, [rawDate])

  useEffect(() => {
    return () => {
      deleteUserAppointmentNotification({
        userId: user.id,
        role: user.role,
        id,
      }).catch(() => {
      })
    }
  }, [])

  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(url)
    closeModal()
  }

  return (
    <ModalBackground closeModal={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <img src='logo.webp' alt='logo' className={styles.logo} height={25} />
          <h4 className={styles.title}>
            {isPostponement ? 'Se ha reprogramado una cita' : 'Se te ha citado'}
          </h4>
        </header>

        <ModalRender
          role={user.role}
          profesional={profesional}
          parsedDate={parsedDate}
          isPostponement={isPostponement}
        />

        <button onClick={handleNavigate} className={styles.see}>
          Ver Cita
        </button>
      </div>
    </ModalBackground>
  )
}
