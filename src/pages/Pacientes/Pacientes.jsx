import { Spinner } from '../../components/spinner/spinner'
import { useUser } from '../../hooks/useUser'
import { USER_POSSIBLE_STATES } from '../../utils/user-possible-states'
import { PacientesPageAdminRender } from './pacientes-page-renders'
import styles from './pacientes-page.module.css'

export function Pacientes() {
  const user = useUser()

  return (
    <main className={styles.main}>
      {user === USER_POSSIBLE_STATES.NOT_KNOWN ? (
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
      ) : (
        <PacientesPageAdminRender />
      )}
    </main>
  )
}
