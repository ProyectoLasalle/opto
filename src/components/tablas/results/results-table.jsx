import { useContext } from 'react'
import { ResultsRow } from './results-row'
import styles from './results-table.module.css'
import { ResultsContext } from '../../../contexts/ResultsContext'
import { Spinner } from '../../spinner/spinner'
import { Circle } from '../../../pages/Home/circle'
import { useUser } from '../../../hooks/useUser'

export function ResultsTable({ pageUser }) {
  const { state } = useContext(ResultsContext)
  const loggedUser = useUser()

  if (state.data.loading) {
    return (
      <div className={styles.tableSkeleton}>
        <Spinner style={{ height: 15, width: 15, borderWidth: 2 }} />
      </div>
    )
  }
  if (state.data.error)
    return (
      <div className={styles.tableSkeleton} style={{ color: 'red' }}>
        <span className={styles.errorMessage}>{state.data.error}</span>
        <Circle
          color='red'
          style={{
            top: '50%',
            right: '50%',
            transform: 'translateY(-43%) translateX(50%)',
          }}
          height={200}
          width={200}
        />
      </div>
    )
  if (!pageUser.deberes.contraste && !pageUser.deberes.preferencial) {
    return (
      <div className={styles.tableSkeleton} style={{ color: 'red' }}>
        <span className={styles.warnMessage}>
          {pageUser.id === loggedUser.id
            ? 'No tienes ninguna prueba asignada, deberás esperar que tu médico te asigne una.'
            : 'El paciente no tiene ninguna prueba asignada, deberás esperar que el médico le asigne una.'}
        </span>
        <Circle
          color='yellow'
          style={{
            top: '50%',
            right: '50%',
            transform: 'translateY(-43%) translateX(50%)',
          }}
          height={200}
          width={200}
        />
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>FECHA</td>
            <td>HORA</td>
            <td>NOMBRE</td>
            <td>DATOS</td>
            <td>NOTA DE REVISIÓN</td>
          </tr>
        </thead>
        <tbody>
          {state.data?.data?.map((el) => {
            if (el === undefined) return null
            return <ResultsRow key={el.id} data={el} />
          })}
        </tbody>
      </table>
    </div>
  )
}
