import { useContext } from 'react'
import { useModalLogic } from '../../../hooks/useModalLogic'
import { PreferencialGraphic } from '../../graphics/preferencial/preferencial'
import { OpacidadGraphic } from '../../graphics/opacidad/opacidad'
import styles from './graphic-modal.module.css'
import { ResultsContext } from '../../../contexts/ResultsContext'

export function GraphicModal({ closeModal }) {
  const { state } = useContext(ResultsContext)
  useModalLogic({ closeModal, scroll: true })

  return (
    <div className={styles.modalBackground} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {state.selected_test.name === 'contraste' ? (
          <OpacidadGraphic />
        ) : (
          <PreferencialGraphic />
        )}
      </div>
    </div>
  )
}
