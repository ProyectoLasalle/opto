import React, { forwardRef } from 'react'
import { PacienteRow } from './paciente-row'
import styles from './pacientes.module.css'

export const PacientesPDF = forwardRef(
  ({ patients, selectedRowId, setSelectedRowId, setSelectedPatient }, ref) => {
    return (
      <div ref={ref}>
        <h1 style={{ textAlign: 'center', marginTop: 50 }}>
          Lista de Pacientes
        </h1>
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
      </div>
    )
  },
)

PacientesPDF.displayName = 'PacientesPDF'
