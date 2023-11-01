import { useContext } from 'react'
import { WriteModalHeader } from '../../write-modal-header/write-modal-header'
import styles from './notes-modal.module.css'
import { ResultsContext } from '../../../contexts/ResultsContext'
import { Note } from './note'
import { useModalLogic } from '../../../hooks/useModalLogic'
import { useUser } from '../../../hooks/useUser'

export function NotesModal({ closeModal, pageUser }) {
  const { state } = useContext(ResultsContext)
  useModalLogic({ closeModal, scroll: true })
  const user = useUser()

  console.log({ state })

  return (
    <div className={styles.modalBackground} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <WriteModalHeader user={pageUser} medic={user.id === pageUser?.id} />
        <div className={styles.body}>
          <h6>Notas</h6>
          {state.notes_open.row_data.notes.map((el) => (
            <Note key={el.date} {...el} />
          ))}
        </div>
      </div>
    </div>
  )
}
