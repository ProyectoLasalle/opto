import styles from './calendario.module.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CalendarEvent } from '../../components/calendar/calendar-event'
import { useCalendar } from '../../hooks/useCalendar'
import { Spinner } from '../../components/spinner/spinner'

export function Calendario({ isPatient }) {
  const { calendarData, loading } = useCalendar({ isPatient })

  return (
    <main className={styles.main}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        editable={false}
        eventContent={CalendarEvent}
        locale={'es'}
        events={calendarData}
        defaultTimedEventDuration={{ minutes: 1 }}
        buttonText={{
          day: 'Hoy',
          prev: 'Anterior',
          next: 'Siguiente',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          dayGridMonth: 'Mes',
          dayGridWeek: 'Semana',
          dayGridDay: 'Día',
        }}
      />

      {loading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </main>
  )
}
