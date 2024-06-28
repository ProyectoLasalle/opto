import styles from './notes-modal.module.css'
import { ModalBackground } from 'components/common/modal-background/modal-background'
import { Modal } from 'components/common/modal/modal'
import { WriteModalHeader } from 'components/write-modal-header/write-modal-header'
import { ResultsContext } from 'contexts/ResultsContext'
import { useModalLogic } from 'hooks/useModalLogic'
import { useUser } from 'hooks/useUser'
import { useContext } from 'react'
import { Note } from './note'

export function NotesModal({ closeModal, pageUser }) {
  const { state } = useContext(ResultsContext)
  useModalLogic({ closeModal, scroll: true })
  const user = useUser()

  return (
    <ModalBackground closeModal={closeModal}>
      <Modal>
        <WriteModalHeader user={pageUser} medic={user.id === pageUser?.id} />
        <div className={styles.body}>
          <h6>Notas</h6>
          {state.notes_open.row_data.notes.map((el) => (
            <Note key={el.date} {...el} />
          ))}
        </div>
      </Modal>
    </ModalBackground>
  )
}
