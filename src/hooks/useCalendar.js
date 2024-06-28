import { useEffect, useState } from 'react'
import { useUser } from './useUser'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser } from '../firebase/utils/user'
import {
  getAllDoctorAppointments,
  getAllPatientAppointments,
} from '../firebase/utils/appointment'

export const useCalendar = ({ isPatient }) => {
  const [loading, setLoading] = useState(true)
  const [calendarData, setCalendarData] = useState([])

  const user = useUser()

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!user) return
    if (!(user.role !== 'admin' || user.id !== id))
      navigate('/login', { replace: true })

    setLoading(true)

    const getData = async () => {
      if (isPatient) {
        const pageUser = await getUser(id, 'patient')

        getAllPatientAppointments({
          doctorId: pageUser.medico_asignado.id,
          patientId: id,
        })
          .then((res) => {
            if (res.length === 0 || !res) return
            setCalendarData(
              res.map((el) => ({
                ...el[0].content,
                url: el[0].url,
                status: el[0].status,
              })),
            )
          })
          .catch((err) => console.log({ err }))
      } else {
        getAllDoctorAppointments(id)
          .then((res) => {
            if (res.length === 0 || !res) return
            setCalendarData(
              res.map((el) => ({
                ...el[0].content,
                url: el[0].url,
                title: `${el[0].patientData.nombre} ${el[0].patientData.apellido}`,
                status: el[0].status,
              })),
            )
          })
          .catch((err) => console.log({ err }))
      }
    }

    getData().finally(() => {
      setLoading(false)
    })
  }, [user])

  return { calendarData, user, loading }
}
