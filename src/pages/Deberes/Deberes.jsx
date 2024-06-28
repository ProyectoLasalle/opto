import { useNavigate, useParams } from 'react-router-dom'
import { TestsAsignadosSection } from '../../components/tests/tests-asignados-section'
import { useUser } from '../../hooks/useUser'
import styles from './deberes.module.css'
import { USER_POSSIBLE_STATES } from '../../utils/user-possible-states'
import { useEffect, useState } from 'react'
import { getUser } from '../../firebase/utils/user'
import { Spinner } from '../../components/spinner/spinner'
import { useModal } from '../../hooks/useModal'
import { DeberesModal } from '../../components/modals/deberes-modal/deberes-modal'

export function Deberes() {
  const [pageUser, setPageUser] = useState(null)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false)

  const { isOpen, closeModal, openModal } = useModal()
  const loggedUser = useUser()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (loggedUser === USER_POSSIBLE_STATES.NOT_KNOWN) return
    if (loggedUser === USER_POSSIBLE_STATES.NOT_LOGGED)
      navigate('/login', { replace: true })

    if (
      loggedUser.role === 'patient' &&
      loggedUser.id !== params.id &&
      loggedUser.role !== 'doctor' &&
      loggedUser.role !== 'admin'
    ) {
      navigate('/', { replace: false })
    }
  }, [loggedUser])

  useEffect(() => {
    if (
      loggedUser === USER_POSSIBLE_STATES.NOT_KNOWN ||
      loggedUser === USER_POSSIBLE_STATES.NOT_LOGGED
    )
      return
    setLoading(true)
    getUser(params.id, 'patient')
      .then(setPageUser)
      .catch((err) => {
        const errMessage = err instanceof Error ? err.message : err
        setError(errMessage)
      })
      .finally(() => setLoading(false))
  }, [loggedUser])

  if (loggedUser === USER_POSSIBLE_STATES.NOT_KNOWN) {
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
      <TestsAsignadosSection
        pageUser={pageUser}
        setPageUser={setPageUser}
        loading={loading}
        setLoading={setLoading}
        openModal={openModal}
      />
      {isOpen && (
        <DeberesModal
          closeModal={closeModal}
          pageUser={pageUser}
          setPageUser={setPageUser}
        />
      )}
    </main>
  )
}
