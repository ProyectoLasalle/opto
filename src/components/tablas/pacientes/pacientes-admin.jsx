import { useRef } from 'react'
import { PacienteRow } from './paciente-row'
import { PacientesPDF } from './pacientes-pdf'
import styles from './pacientes.module.css'
import { useReactToPrint } from 'react-to-print'

export function PacientesAdmin({
  patients,
  selectedRowId,
  setSelectedRowId,
  setSelectedPatient,
}) {
  const tableRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: 'pacientes',
  })

  return (
    <>
      <div className={styles.exportButton}>
        <button onClick={handlePrint}>Exportar a PDF</button>
      </div>
      <div style={{ display: 'none' }}>
        <PacientesPDF
          ref={tableRef}
          patients={patients}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          setSelectedPatient={setSelectedPatient}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre y apellido</th>
            <th>Correo</th>
            <th>Status</th>
            <th>Habeas Data Login</th>
            <th>Habeas Data Tests</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((el) => (
            <PacienteRow
              key={el.id}
              isSelected={el.id === selectedRowId}
              handleClick={() => {
                setSelectedRowId(el.id)
                setSelectedPatient(el)
              }}
              {...el}
            />
          ))}
        </tbody>
      </table>
    </>
  )
}
