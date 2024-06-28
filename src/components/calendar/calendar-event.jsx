const statusStyles = {
  pending: {
    backgroundColor: 'rgb(var(--amarillo))',
  },
  confirmed: {
    backgroundColor: 'rgb(10, 240, 10)',
    color: 'white',
  },
  canceled: {
    backgroundColor: 'rgb(255, 0, 0)',
  },
}

const statusNames = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  canceled: 'Cancelada',
}

const statusParser = (status) => {
  const { patient, doctor } = status
  if (patient === 'canceled' || doctor === 'canceled') return 'canceled'
  if (patient === 'pending' || doctor === 'pending') return 'pending'
  return 'confirmed'
}

export function CalendarEvent({ event, timeText }) {
  const { status } = event.extendedProps
  const finalStatus = statusParser(status)

  return (
    <div
      title={statusNames[finalStatus]}
      style={{
        width: '100%',
        borderRadius: 5,
        display: 'flex',
        gap: 5,
        ...statusStyles[finalStatus],
      }}>
      <b>{timeText}</b>
      <i>{event.title}</i>
    </div>
  )
}
