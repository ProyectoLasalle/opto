import { useCallback, useState } from 'react'
import { InputWUnderline } from '../../common/input-w-underline/input-w-underline'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './postpone-appointment-modal.module.css'
import { Spinner } from '../../spinner/spinner'
import { toast } from 'react-toastify'
import { postponeAppointment } from '../../../firebase/utils/appointment'
import { useUser } from '../../../hooks/useUser'
import { useLocation, useParams } from 'react-router-dom'
import { arrayUnion } from 'firebase/firestore'
import { updateUser } from '../../../firebase/utils/user'
import { API_APPOINTMENTS } from '../../../utils/prod-dev-variables'
import { auth } from '../../../firebase/config'
import { generateId } from '../../../utils/generate-id'

export function PostponeAppointmentModal({ closeModal, data, setData }) {
  const [loading, setLoading] = useState(false)

  const user = useUser()
  const params = useParams()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setLoading(true)

      const url = location.pathname
      const patient = data.patientData
      const doctor = data.doctorData

      const content = Object.fromEntries(new FormData(e.target))
      const { date } = content
      if (new Date(date) < Date.now()) {
        toast.error('La fecha de creación debe ser posterior a la actual')
        setLoading(false)
        return
      }

      const setByAdmin = user.role === 'admin'

      await postponeAppointment({
        ...params,
        newDate: date,
      })
        .then((url) => {
          toast('La cita se ha reprogramado correctamente')
          return url
        })
        .catch((err) => {
          const errMessage = err.message.endsWith(
            'ya tiene una cita a esa hora.',
          )
            ? err.message
            : 'Ha ocurrido un error al reprogramar la cita'
          toast.error(errMessage)
        })

      const id = generateId()

      updateUser({
        id: patient.id,
        claim: 'patient',
        update: {
          notifications: arrayUnion({
            type: 'postpone-appointment',
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
        method: 'PATCH',
      })

      if (setByAdmin) {
        updateUser({
          id: doctor.id,
          claim: 'doctor',
          update: {
            notifications: arrayUnion({
              type: 'postpone-appointment',
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
          method: 'PATCH',
        })
      }

      setData((prev) => ({
        ...prev,
        content: { ...prev.content, date },
        status: { ...prev.status, doctor: 'pending', patient: 'pending' },
      }))

      setLoading(false)
      closeModal()
    },
    [data, user],
  )

  return (
    <ModalBackground closeModal={closeModal}>
      <form
        className={styles.modal}
        onSubmit={handleSubmit}
        onClick={(e) => {
          e.stopPropagation()
        }}>
        <div className={styles.formGroup}>
          <label htmlFor='fecha'>Fecha y hora</label>
          <InputWUnderline
            type='datetime-local'
            autoFocus
            id='date'
            name='date'
            required
            style={{ outline: 'none', padding: '2px 5px' }}
          />
        </div>

        <button type='submit' disabled={loading} className={styles.submit}>
          {loading ? (
            <Spinner style={{ width: 8, height: 8, borderWidth: 1 }} />
          ) : (
            'Posponer cita'
          )}
        </button>
      </form>
    </ModalBackground>
  )
}
