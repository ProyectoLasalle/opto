import { useContext, useState } from 'react'
import { useUser } from '../../../hooks/useUser'
import { WriteModalHeader } from '../../write-modal-header/write-modal-header'
import styles from './write-note-modal.module.css'
import { addNoteToTest } from '../../../firebase/utils/paciente'
import { Spinner } from '../../spinner/spinner'
import { toast } from 'react-toastify'
import { ResultsContext } from '../../../contexts/ResultsContext'
import { Modal } from '../../common/modal/modal'
import { ModalBackground } from 'components/common/modal-background/modal-background'

export function WriteNoteModal({ closeModal, pageUser, rowData }) {
  const [status, setStatus] = useState(null)

  const { dispatch } = useContext(ResultsContext)

  const user = useUser()

  const handleSend = (e) => {
    e.preventDefault()
    setStatus('loading')
    const { note } = Object.fromEntries(new FormData(e.target))

    addNoteToTest(rowData.ref, note, user)
      .then(() => {
        toast('La nota se envió correctamente.')
        dispatch({
          type: 'addNote',
          payload: {
            id: rowData.id,
            newNote: { note, user, date: Date.now() },
          },
        })
      })
      .catch(() => {
        toast.error('Hubo un error al enviar la nota.')
      })
      .finally(() => setStatus(null))
  }

  return (
    <ModalBackground closeModal={closeModal}>
      <Modal>
        <WriteModalHeader user={user} />
        <form className={styles.body} onSubmit={handleSend}>
          <p>
            Escribe tu nota para el paciente {pageUser.nombre}{' '}
            {pageUser.apellido}
          </p>
          <div className={styles.inputContainer}>
            <textarea
              disabled={status === 'loading'}
              id='note'
              name='note'
              placeholder={`Estimado ${pageUser.nombre} ${pageUser.apellido}...`}
            />
            <div className={styles.after} />
          </div>
          <button type='submit'>
            {status === 'loading' ? (
              <Spinner
                style={{
                  color: 'black',
                  borderWidth: 2,
                  width: 10,
                  height: 10,
                }}
              />
            ) : (
              'Enviar'
            )}
          </button>
        </form>
      </Modal>
    </ModalBackground>
  )
}
