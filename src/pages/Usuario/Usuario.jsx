import styles from './usuario.module.css'
import { USER_POSSIBLE_STATES } from '../../utils/user-possible-states'
import { Spinner } from '../../components/spinner/spinner'
import { useUser } from '../../hooks/useUser'
import { UserProfile } from '../../components/user-profile/user-profile'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'

export function Usuario({ type = 'patient' }) {
  const user = useUser()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (user === USER_POSSIBLE_STATES.NOT_KNOWN) return
    if (user === USER_POSSIBLE_STATES.NOT_LOGGED)
      navigate('/login', { replace: true })

    if (
      user.role === 'patient' &&
      user.id !== params.id &&
      user.role !== 'doctor' &&
      user.role !== 'admin'
    ) {
      navigate('/', { replace: false })
    }
  }, [user])

  if (user === USER_POSSIBLE_STATES.NOT_KNOWN) {
    return (
      <div className={styles.loadingUser}>
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
    <main className={styles.main}>
      <UserProfile id={params.id} type={type} />
    </main>
  )
}
