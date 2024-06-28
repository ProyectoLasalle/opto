import { useModalLogic } from '../../../hooks/useModalLogic'
import styles from './delete-modal.module.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Spinner } from '../../spinner/spinner'
import { cerrarSesion, deleteUser } from '../../../firebase/utils/user'
import { useUser } from '../../../hooks/useUser'

export function DeleteModal({
  closeModal,
  user,
  closeProfileModal,
  deletePatient,
}) {
  const [status, setStatus] = useState(null)
  const loggedUser = useUser()

  useModalLogic({ closeModal })

  const navigate = useNavigate()

  const handleDelete = () => {
    setStatus('loading')
    deleteUser(user)
      .then((res) => {
        if (!res.ok) throw new Error('')
        setStatus('success')
        deletePatient && deletePatient(user.id)
        toast('El usuario se borró correctamente.')
        closeProfileModal
          ? closeProfileModal()
          : navigate('/pacientes', { replace: true })
        loggedUser.id === user.id && cerrarSesion()
      })
      .catch((err) => {
        setStatus('error')
        toast.error('Hubo un error al borrar el usuario')
      })
  }

  return (
    <div
      className={styles.modalBackground}
      onClick={() => status !== 'loading' && closeModal()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h4>
          Desea borrar el usuario {user.nombre} {user.apellido}?
        </h4>
        <span>
          Este cambio es irreversible y también borrará todos los tests
          asignados al dni del usuario.
        </span>
        <div className={styles.buttons}>
          <button onClick={closeModal}>Cancelar</button>
          <button onClick={handleDelete}>Aceptar</button>
        </div>
        <div className={styles.loading} data-loading={status === 'loading'}>
          {status === 'loading' && (
            <Spinner
              width={30}
              height={30}
              style={{ color: 'var(--azul-profundo)' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
