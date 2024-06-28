import { useEffect, useState } from 'react'
import { useUser } from '../../hooks/useUser'
import styles from '../../pages/Appointment/appointment.module.css'
import { Spinner } from '../spinner/spinner'
import { confirmAppointment } from '../../firebase/utils/appointment'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { USER_POSSIBLE_STATES } from '../../utils/user-possible-states'

const statusStyles = {
  pending: {
    backgroundColor: 'rgb(var(--amarillo))',
  },
  confirmed: {
    backgroundColor: 'rgb(0, 255, 0)',
  },
  canceled: {
    backgroundColor: 'rgb(255, 0, 0)',
  },
}

const statusNames = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  canceled: 'Cancelada',
}

export function AppointmentStatus({
  data,
  setData,
  setIsCancelling,
  setIsPostponing,
}) {
  const [isLoading, setisLoading] = useState({ patient: false, doctor: false })
  const user = useUser()

  const doctorStatus = data?.status.doctor
  const patientStatus = data?.status.patient

  const isCanceled = data?.status[user.role] === 'canceled'
  const showConfirmation =
    !isCanceled &&
    data.status[user.role] === 'pending' &&
    data[`${user.role}Data`].id === user.id
  const showPostponementButton =
    !isCanceled &&
    (user.role === 'admin' ||
      (user.role === 'doctor' && data[`${user.role}Data`].id === user.id))

  const params = useParams()

  const handleConfirm = () => {
    setisLoading((prev) => ({ ...prev, [user.role]: true }))
    confirmAppointment({ ...params, byDoctor: user.role === 'doctor' })
      .then(() => {
        toast('Confirmaste la cita correctamente.')
        setData((prev) => ({
          ...prev,
          status: { ...prev.status, [user.role]: 'confirmed' },
        }))
      })
      .catch((err) => console.log({ err }))
      .finally(() => {
        setisLoading((prev) => ({ ...prev, [user.role]: false }))
      })
  }
  const handlePostponement = () => {
    setIsPostponing(true)
  }
  const handleCancel = () => {
    setIsCancelling(true)
  }

  const confirm = new URLSearchParams(location.search).get('confirm')

  useEffect(() => {
    if (user === USER_POSSIBLE_STATES.NOT_KNOWN) return
    if (!data) return
    if (
      user &&
      confirm &&
      (data.patientData.id === user.id || data.doctorData.id === user.id)
    ) {
      handleConfirm()
    }
  }, [user])

  return (
    <div className={styles.estado}>
      <p>Estado de la cita</p>
      <div className={styles.horizontal}>
        <div>
          <p>Paciente</p>
          <div className={styles.status} style={statusStyles[patientStatus]}>
            {statusNames[patientStatus]}
          </div>
        </div>
        <div>
          <p>Profesional</p>
          <div className={styles.status} style={statusStyles[doctorStatus]}>
            {statusNames[doctorStatus]}
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        {showConfirmation && (
          <button
            className={styles.confirm}
            onClick={handleConfirm}
            disabled={isLoading[user.role]}>
            {isLoading[user.role] ? (
              <Spinner style={{ height: 8, width: 8, borderWidth: 1 }} />
            ) : (
              'Confirmar'
            )}
          </button>
        )}
        {showPostponementButton && (
          <button
            className={styles.postponement}
            onClick={handlePostponement}
            disabled={isLoading[user.role]}>
            {isLoading[user.role] ? (
              <Spinner style={{ height: 8, width: 8, borderWidth: 1 }} />
            ) : (
              'Reprogramar'
            )}
          </button>
        )}
        {!isCanceled && user.role !== 'admin' && (
          <button onClick={handleCancel} disabled={isLoading[user.role]}>
            {isLoading[user.role] ? (
              <Spinner style={{ height: 8, width: 8, borderWidth: 1 }} />
            ) : (
              'Cancelar'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
