import { useContext } from 'react'
import styles from './results-header-buttons.module.css'
import { ResultsContext } from '../../contexts/ResultsContext'

export function ResultsHeaderButtons({ pageUser }) {
  const { state, dispatch } = useContext(ResultsContext)

  return (
    <div className={styles.buttons}>
      {pageUser && pageUser.deberes?.preferencial && (
        <div
          className={styles.buttonContainer}
          data-selected={state.selected_test.name === 'preferencial'}>
          <button
            onClick={() =>
              state.selected_test.name !== 'preferencial' &&
              dispatch({ type: 'setPreferencial' })
            }>
            Mirada Preferencial
          </button>
          <div className={styles.line} />
        </div>
      )}
      {pageUser && pageUser.deberes?.contraste && (
        <div
          className={styles.buttonContainer}
          data-selected={state.selected_test.name === 'contraste'}>
          <button
            onClick={() =>
              state.selected_test.name !== 'contraste' &&
              dispatch({ type: 'setContraste' })
            }>
            Contraste
          </button>
          <div className={styles.line} />
        </div>
      )}
    </div>
  )
}
