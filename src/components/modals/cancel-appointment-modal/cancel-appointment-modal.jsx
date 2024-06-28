import { useParams } from 'react-router-dom'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './cancel-appointment-modal.module.css'
import { InputWUnderline } from '../../common/input-w-underline/input-w-underline'
import { cancelAppointment } from '../../../firebase/utils/appointment'
import { useState } from 'react'
import { useUser } from '../../../hooks/useUser'
import { toast } from 'react-toastify'
import { Spinner } from '../../spinner/spinner'
import { updateUser } from '../../../firebase/utils/user'
import { arrayUnion } from 'firebase/firestore'
import { API_APPOINTMENTS } from '../../../utils/prod-dev-variables'
import { auth } from '../../../firebase/config'
import { generateId } from '../../../utils/generate-id'

export function CancelAppointmentModal({ closeModal, data, setData }) {
  const [status, setStatus] = useState(null)

  const params = useParams()
  const user = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const { reason } = Object.fromEntries(new FormData(e.target))

    const setByAdmin = user.role === 'admin'
    const url = location.pathname
    const patient = data.patientData
    const doctor = data.doctorData
    const date = data.content.date

    await cancelAppointment({
      ...params,
      byDoctor: user.role === 'doctor',
      reason,
    })
      .then(() => {
        toast('Cita cancelada correctamente.')
        closeModal()
      })
      .catch((err) => {
        toast('Ocurrió un error al cancelar la cita.')
        setStatus(null)
      })

    const id = generateId()

    updateUser({
      id: patient.id,
      claim: 'patient',
      update: {
        notifications: arrayUnion({
          type: 'cancel-appointment',
          date,
          url,
          id,
        }),
      },
    })

    const token = await auth.currentUser.getIdToken(true)
    fetch(API_APPOINTMENTS, {
      body: JSON.stringify({
        link: url,
        date,
        to: patient.email,
        title: data.content.title,
        description: data.content.description,
      }),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })

    if (setByAdmin) {
      updateUser({
        id: doctor.id,
        claim: 'doctor',
        update: {
          notifications: arrayUnion({
            type: 'cancel-appointment',
            date,
            url,
            id,
          }),
        },
      })

      fetch(API_APPOINTMENTS, {
        body: JSON.stringify({
          link: url,
          date,
          to: doctor.email,
          title: data.content.title,
          description: data.content.description,
          setByAdmin,
        }),
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })
    }

    setData((prev) => ({
      ...prev,
      content: { ...prev.content, date },
      status: { ...prev.status, [user.role]: 'canceled' },
    }))

    closeModal()
  }

  return (
    <ModalBackground closeModal={closeModal}>
      <form
        onSubmit={handleSubmit}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}>
        <h2>¿Seguro de que deseas cancelar la cita?</h2>
        <p>Si cancelas la cita, no podrás volver a agendarla.</p>

        <label htmlFor='reason'>Motivo de cancelación</label>
        <InputWUnderline id='reason' name='reason' autoFocus required />
        <button type='submit' disabled={status === 'loading'}>
          {status === null ? (
            'Cancelar cita'
          ) : (
            <Spinner style={{ width: 8, height: 8, borderWidth: 1 }} />
          )}
        </button>
      </form>
    </ModalBackground>
  )
}
