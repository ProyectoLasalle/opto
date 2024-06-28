import { Spinner } from '../../spinner/spinner'
import styles from './asignacion-dashboard.module.css'
import { PersonEntry } from './person-entry'
import { TableError } from './table-error'

function AsignacionAssignedRender({ data, deassignPatient, selectedDoctor }) {
  return (
    <div className={styles.tableData}>
      {data.loading ? (
        <Spinner
          style={{
            height: 15,
            width: 15,
            color: 'var(--azul-profundo)',
            margin: 'auto',
          }}
        />
      ) : data.error ? (
        <TableError err={data.error} />
      ) : data.data ? (
        data.data.map((el) => (
          <PersonEntry key={el.id} className={styles.person}>
            {el.image?.src ? (
              <img
                className={styles.userImage}
                src={el.image.src}
                alt='Foto de usuario'
              />
            ) : (
              <div id={'userImage'} />
            )}
            <span>
              {el.nombre} {el.apellido}
            </span>
            <button
              onClick={() =>
                deassignPatient({ patient: el, doctor: selectedDoctor })
              }
              className={styles.assign}>
              Quitar
            </button>
          </PersonEntry>
        ))
      ) : null}
    </div>
  )
}

export function AsignacionSelectedTable({
  assignedData,
  deassignPatient,
  selectedDoctor,
}) {
  if (!assignedData.data) return null
  return (
    <div className={styles.assignedTable}>
      <header>
        Pacientes asignados al Profesional {selectedDoctor.nombre}{' '}
        {selectedDoctor.apellido}
      </header>
      {
        <AsignacionAssignedRender
          data={assignedData}
          deassignPatient={deassignPatient}
          selectedDoctor={selectedDoctor}
        />
      }
    </div>
  )
}
