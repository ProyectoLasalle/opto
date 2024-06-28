import { AsignacionDashboard } from '../../../components/dashboard/asignacion-dashboard/asignacion-dashboard'
import { Spinner } from '../../../components/spinner/spinner'
import { useUser } from '../../../hooks/useUser'
import { USER_POSSIBLE_STATES } from '../../../utils/user-possible-states'
import styles from './asignacion.module.css'

export function Asignacion() {
  const user = useUser()

  if (user === USER_POSSIBLE_STATES.NOT_KNOWN) {
    return (
      <div className={styles.loading}>
        <Spinner
          style={{
            color: 'var(--azul-profundo)',
            width: 20,
            height: 20,
            borderWidth: '2px',
          }}
        />
      </div>
    )
  }

  return (
    <section className={styles.pageSection}>
      <h1>Asignación de pacientes</h1>
      <AsignacionDashboard />
    </section>
  )
}
