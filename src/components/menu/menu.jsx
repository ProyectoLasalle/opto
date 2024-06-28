import { Link } from 'react-router-dom'
import { EditIcon } from '../icons/edit'
import { BookIcon } from '../icons/book'
import styles from './menu.module.css'
import { useUser } from '../../hooks/useUser'
import { useMemo } from 'react'
import { UserImage } from '../common/entry-placeholder/user-image/user-image'
import { ResultsIcon } from '../icons/results'

export function Menu({ patient, setIsEditing, setIsAppointment }) {
  const user = useUser()

  const entrys = useMemo(() => {
    if (!patient) return []
    return user.role === 'doctor'
      ? [
          {
            type: 'a',
            to: `/paciente/${patient.id}/pruebas-clinicas`,
            icon: BookIcon,
            text: 'Deberes',
            key: 1,
          },
          {
            type: 'a',
            to: `/paciente/${patient.id}/resultados`,
            icon: ResultsIcon,
            text: 'Resultados',
            key: 2,
          },
          {
            type: 'button',
            onClick: setIsAppointment,
            icon: EditIcon,
            text: 'Agendar cita',
            key: 3,
          },
        ]
      : [
          {
            type: 'a',
            to: `/paciente/${patient.id}/resultados`,
            icon: ResultsIcon,
            text: 'Resultados',
            key: 3,
          },
          {
            type: 'button',
            onClick: setIsEditing,
            icon: EditIcon,
            text: 'Editar',
            key: 1,
          },
          {
            type: 'a',
            to: `/paciente/${patient.id}/pruebas-clinicas`,
            icon: BookIcon,
            text: 'Deberes',
            key: 2,
          },
          {
            type: 'button',
            onClick: setIsAppointment,
            icon: EditIcon,
            text: 'Agendar cita',
            key: 4,
          },
        ]
  }, [user, setIsEditing, patient])

  return (
    <section className={`${styles.menu} ${patient ?? styles.closed}`}>
      {!patient ? null : (
        <>
          <Link to={`/paciente/${patient.id}`}>
            <UserImage src={patient.image?.src} />
            <h4>{patient?.nombre}</h4>
          </Link>
          {entrys.map((el) => {
            return el.type === 'button' ? (
              <button
                key={el.key}
                onClick={el.onClick}
                style={{ border: 'none' }}>
                <el.icon
                  height={36}
                  width={36}
                  style={{
                    color: 'transparent',
                    stroke: 'black',
                    strokeWidth: 1,
                  }}
                />
                <h4>{el.text}</h4>
              </button>
            ) : (
              <Link key={el.key} to={el.to}>
                <el.icon
                  height={36}
                  width={36}
                  style={{
                    color: 'transparent',
                    stroke: 'black',
                    strokeWidth: 1,
                  }}
                />
                <h4>{el.text}</h4>
              </Link>
            )
          })}
        </>
      )}
    </section>
  )
}
