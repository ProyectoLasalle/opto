import { useContext, useState } from 'react'
import { useModalLogic } from '../../../hooks/useModalLogic'
import styles from './delete-note-modal.module.css'
import { ResultsContext } from '../../../contexts/ResultsContext'
import { deleteNoteToTest } from '../../../firebase/utils/paciente'
import { toast } from 'react-toastify'
import { Spinner } from '../../spinner/spinner'

export function DeleteNoteModal({ closeModal }) {
  const [status, setStatus] = useState(null)
  const { dispatch, state } = useContext(ResultsContext)

  const handleDelete = () => {
    setStatus('loading')
    deleteNoteToTest(state.notes_open.row_data.ref, state.deleting)
      .then(() => {
        toast('La nota se borró correctamente')
        dispatch({
          type: 'removeNote',
          payload: { id: state.notes_open.row_data.id, note: state.deleting },
        })
      })
      .catch(() => {
        toast.error('Hubo un error al borrar la nota')
      })
      .finally(closeModal)
  }

  useModalLogic({ closeModal })
  return (
    <div className={styles.modalBackground} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Deseas borrar esta nota?</h3>
        <p>Esta acción es irreversible.</p>
        <div className={styles.buttons}>
          <button onClick={closeModal}>Cancelar</button>
          <button onClick={handleDelete}>
            {status === 'loading' ? (
              <Spinner style={{ height: 13, width: 13, borderWidth: 2 }} />
            ) : (
              'Aceptar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
