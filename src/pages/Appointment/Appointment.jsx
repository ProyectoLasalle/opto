import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from './appointment.module.css'
import { useEffect, useMemo, useState } from 'react'
import { getSingleAppointment } from '../../firebase/utils/appointment'
import { useUser } from '../../hooks/useUser'
import { USER_POSSIBLE_STATES } from '../../utils/user-possible-states'
import { Spinner } from '../../components/spinner/spinner'
import { AppointmentHeader } from '../../components/appointment/appointment-header'
import { AppointmentStatus } from '../../components/appointment/appointment-status'
import { CancelAppointmentModal } from '../../components/modals/cancel-appointment-modal/cancel-appointment-modal'
import { LoginModal } from '../../components/modals/login-modal/login-modal'
import { PostponeAppointmentModal } from '../../components/modals/postpone-appointment-modal/postpone-appointment-modal'
import { DownArrowIcon } from '../../components/icons/down-arrow'

function UserLoadingRender({ children, user, status, data }) {
  if (user === USER_POSSIBLE_STATES.NOT_KNOWN || status === 'loading' || !data)
    return (
      <div className={styles.loading}>
        <Spinner
          style={{
            color: 'rgba(0,0,0,.2)',
            height: 20,
            width: 20,
            borderWidth: 3,
          }}
        />
      </div>
    )

  return children
}

export function Appointment() {
  const [status, setStatus] = useState(null)
  const [data, setData] = useState(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const [isPostponing, setIsPostponing] = useState(false)

  const user = useUser()
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const confirm = new URLSearchParams(location.search).get('confirm')

  useEffect(() => {
    if (user === USER_POSSIBLE_STATES.NOT_KNOWN) return
    if (user === USER_POSSIBLE_STATES.NOT_LOGGED && !confirm)
      navigate('/login', { replace: true })
    if (user === USER_POSSIBLE_STATES.NOT_LOGGED && confirm) {
      setIsLogging(true)
      return
    }
    if (!params.appointmentId || !params.doctorId || !params.number) {
      setStatus('error')
      return
    }
    setStatus('loading')
    getSingleAppointment(params)
      .then((appointment) => {
        setData(appointment)
        setStatus('success')
      })
      .catch((e) => {
        console.log(e)
        setStatus('error')
      })
  }, [user])

  const parsedDate = useMemo(() => {
    if (!data) return ''
    const [date, time] = data.content.date.split('T')

    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year} a las ${time}hs`
  }, [data])

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <main className={styles.main}>
      <button onClick={handleBack} className={styles.back}>
        <DownArrowIcon
          height={30}
          width={30}
          style={{ transform: 'rotate(90deg)' }}
          fill='transparent'
        />
      </button>
      <UserLoadingRender user={user} status={status} data={data}>
        <section className={styles.card}>
          <span className={styles.date}>{parsedDate}</span>
          <AppointmentHeader user={user} data={data} />
          <p className={styles.for}>
            Citación para {data?.patientData?.nombre}{' '}
            {data?.patientData?.apellido}
          </p>
          <article className={styles.body}>
            <h1>{data?.content?.title}</h1>
            <p>{data?.content?.description}</p>
          </article>
          <AppointmentStatus
            data={data}
            setData={setData}
            setIsCancelling={setIsCanceling}
            setIsPostponing={setIsPostponing}
          />
        </section>
      </UserLoadingRender>

      {isCanceling && (
        <CancelAppointmentModal
          closeModal={() => setIsCanceling(false)}
          data={data}
          setData={setData}
        />
      )}
      {isPostponing && (
        <PostponeAppointmentModal
          closeModal={() => setIsPostponing(false)}
          data={data}
          setData={setData}
        />
      )}
      {isLogging && (
        <LoginModal
          closeModal={() => {
            setIsLogging(false)
          }}
        />
      )}
    </main>
  )
}
