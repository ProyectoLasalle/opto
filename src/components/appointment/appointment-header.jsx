import styles from '../../pages/Appointment/appointment.module.css'
import { UserImage } from '../common/entry-placeholder/user-image/user-image'

export function AppointmentHeader({ data, user }) {
  return (
    <header className={styles.header}>
      <div style={{ margin: 'auto' }}>
        <UserImage src={data?.doctorData?.image} />
      </div>
      <div className={styles.vertical}>
        <p>
          {data.doctorData.nombre} {data.doctorData.apellido}
        </p>
        {user.medico_asignado?.id === data.doctorData.id && (
          <p className={styles.asignado}>Tu médico asignado</p>
        )}
      </div>
    </header>
  )
}
