import { Link } from 'react-router-dom'
import { Spinner } from '../../spinner/spinner'
import styles from './asignacion-dashboard.module.css'
import { PersonEntry } from './person-entry'
import { TableError } from './table-error'

function AsignacionDoctorsTableRender({
  data,
  refetch,
  selectedDoctor,
  setSelectedDoctor,
}) {
  return (
    <div className={styles.tableData}>
      {data.loading ? (
        <Spinner
          style={{ height: 15, width: 15, color: 'var(--azul-profundo)' }}
        />
      ) : data.error ? (
        <TableError refetch={refetch} err={data.error} />
      ) : data.data ? (
        data.data.map((el) => (
          <PersonEntry
            key={el.id}
            data-selected={el.id === selectedDoctor?.id}
            className={styles.person}
            onClick={() => {
              setSelectedDoctor(el)
            }}>
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
              Dr. {el.nombre} {el.apellido}
            </span>
            <Link className={styles.see} to={`/profesional/${el.id}`}>
              Ver
            </Link>
            <p>{el.pacientes_asignados.length}</p>
          </PersonEntry>
        ))
      ) : null}
    </div>
  )
}

export function AsignacionDoctorsTable({
  doctorsData,
  refetch,
  setSelectedDoctor,
  selectedDoctor,
}) {
  return (
    <div className={styles.doctorsTable} data-loading={doctorsData.loading}>
      <header>
        <p>Profesional</p>
        <p>Pacientes Asignados</p>
      </header>
      <AsignacionDoctorsTableRender
        data={doctorsData}
        refetch={refetch}
        setSelectedDoctor={setSelectedDoctor}
        selectedDoctor={selectedDoctor}
      />
    </div>
  )
}
