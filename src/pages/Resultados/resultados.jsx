import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from 'hooks/useUser'
import styles from './resultados.module.css'
import { USER_POSSIBLE_STATES } from 'utils/user-possible-states'
import { useContext, useEffect, useState } from 'react'
import { Spinner } from 'components/spinner/spinner'
import { ResultsTable } from 'components/tablas/results/results-table'
import { ResultsContext } from 'contexts/ResultsContext'
import { GraphicModal } from 'components/modals/graphic-modal/graphic-modal'
import { ResultsHeaderButtons } from 'components/results-header-buttons/results-header-buttons'
import { WriteNoteModal } from 'components/modals/write-note-modal/write-note-modal'
import { NotesModal } from 'components/modals/notes-modal/notes-modal'
import { DeleteNoteModal } from 'components/modals/delete-note-modal/delete-note-modal'
import { getPatientTests } from '../../firebase/utils/paciente'
import { getUser } from '../../firebase/utils/user'
import { DeleteResultModal } from 'components/modals/delete-result-modal/delete-result-modal'

export function Resultados() {
  const [loading, setLoading] = useState(true)
  const [pageUser, setPageUser] = useState(null)
  const [error, setError] = useState(null)

  const { state, dispatch } = useContext(ResultsContext)

  const loggedUser = useUser()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!pageUser) return
    if (!pageUser.deberes.contraste && !pageUser.deberes.preferencial) return

    const initialTest = pageUser.deberes.preferencial
      ? 'Preferencial'
      : 'Contraste'

    dispatch({ type: `set${initialTest}` })
  }, [pageUser])

  useEffect(() => {
    if (!state.selected_test.name || !pageUser) return
    if (!pageUser.documento) {
      setError(
        'Para acceder a tus resultados tienes que tener un dni asignado a tu cuenta',
      )
      return
    }
    getPatientTests(pageUser.documento, state.selected_test.key)
      .then((data) => {
        dispatch({ type: 'setData', payload: data })
      })
      .catch((e) => {
        const errMessage =
          e?.message === 'notfound'
            ? params.id === loggedUser.id
              ? 'No se encontró ningún resultado asignado a tu dni. Descarga los tests en la pestaña de Pruebas Clínicas y realiza las pruebas.'
              : 'No se encontró ningún resultado asignado al dni del paciente.'
            : 'Hubo un error al recuperar los tests.'
        dispatch({
          type: 'setDataError',
          payload: errMessage,
        })
      })
  }, [state.selected_test.name])

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

  if (loggedUser === USER_POSSIBLE_STATES.NOT_KNOWN || loading) {
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

  if (error) {
    return (
      <main className={styles.loadingUser}>
        <span className={styles.errorMessage}>{error}</span>
      </main>
    )
  }

  return (
    <>
      <main className={styles.main}>
        <header>
          <h1>Resultados</h1>
          <ResultsHeaderButtons pageUser={pageUser} />
        </header>
        <section className={styles.dataSection}>
          <ResultsTable pageUser={pageUser} />
        </section>
      </main>
      {state.graphic_open && (
        <GraphicModal closeModal={() => dispatch({ type: 'closeGraphic' })} />
      )}
      {state.write_open.open && (
        <WriteNoteModal
          rowData={state.write_open.row_data}
          pageUser={pageUser}
          closeModal={() => dispatch({ type: 'closeWrite' })}
        />
      )}
      {state.notes_open.open && (
        <NotesModal
          closeModal={() => dispatch({ type: 'closeNotes' })}
          pageUser={pageUser}
        />
      )}
      {state.deleting && (
        <DeleteNoteModal
          closeModal={() => dispatch({ type: 'closeDeleting' })}
          date={state.editing}
        />
      )}
      {state.delete_open.open && (
        <DeleteResultModal
          closeModal={() => dispatch({ type: 'closeDelete' })}
          data={state.delete_open.row_data}
          pageUser={pageUser}
        />
      )}
    </>
  )
}

// {pageUser && Object.values(pageUser?.deberes).some((el) => el) ? (
//   selectedTest === 'contraste' ? (
//     <OpacidadGraphic user={pageUser} />
//   ) : (
//     <PreferencialGraphic user={pageUser} />
//   )
// ) : (
//   <>
//     {pageUser?.id === loggedUser?.id ? (
//       pageUser.documento === '' ? (
//         <Link
//           style={{ textAlign: 'center' }}
//           to={`/paciente/${loggedUser.id}`}>
//           Para acceder a los tests tienes que tener configurado tu
//           número de DNI, accede clickeando aquí.
//         </Link>
//       ) : (
//         <span style={{ textAlign: 'center' }}>
//           No tienes ningún test asignado aún.
//         </span>
//       )
//     ) : (
//       <span style={{ textAlign: 'center' }}>
//         El usuario no tiene ningún test asignado o no tiene asignado su
//         número de dni.
//       </span>
//     )}
//   </>
// )}
