import { Modal } from 'components/common/modal/modal'
import { Button } from 'components/common/button/button'
import { deleteResult } from '../../../firebase/utils/results'
import { toast } from 'react-toastify'
import { useContext, useState } from 'react'
import { Spinner } from 'components/spinner/spinner'
import { ResultsContext } from 'contexts/ResultsContext'

export function DeleteResultModal({ closeModal, data }) {
  const { dispatch } = useContext(ResultsContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  console.log({ data })

  const handleDelete = async () => {
    setLoading(true)
    deleteResult(data.ref)
      .then(() => {
        dispatch({ type: 'deleteResult', payload: data.id })
        toast.success('El resultado se ha borrado correctamente')
        closeModal()
      })
      .catch((e) => {
        console.error(e)
        setError(
          'Hubo un error al borrar el resultado, porfavor inténtalo denuevo.',
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal.Background closeModal={closeModal}>
      <Modal>
        <Modal.Title>
          Estas seguro de que deseas borrar el resultado?
        </Modal.Title>
        <Modal.Body>
          <Modal.Text>
            Esta decisión es permanente y no se puede revertir.
          </Modal.Text>
          {error && (
            <Modal.Text style={{ color: 'var(--destructive)' }}>
              {error}
            </Modal.Text>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Cancelar</Button>
          <Button onClick={handleDelete} variant='destructive'>
            {loading ? (
              <div style={{ width: 40 }}>
                <Spinner style={{ height: 10, width: 10, borderWidth: 2 }} />
              </div>
            ) : (
              'Borrar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal.Background>
  )
}
