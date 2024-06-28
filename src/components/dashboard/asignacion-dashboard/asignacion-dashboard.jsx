import { useCallback, useEffect, useReducer } from 'react'
import styles from './asignacion-dashboard.module.css'
import {
  INITIAL_ASIGNACION_STATE,
  asignacionReducer,
} from '../../../reducers/asignacion-reducer'
import { AsignacionDoctorsTable } from './asignacion-doctors-table'
import { AsignacionPatientsTable } from './asignacion-patients-table'
import { AsignacionSelectedTable } from './asignacion-selected-table'
import {
  assignPatientToDoctor,
  deassignPatientToDoctor,
  getAllDoctors,
} from '../../../firebase/utils/medicos'
import { useUser } from '../../../hooks/useUser'
import { getAllPatientsWithoutDoctor } from '../../../firebase/utils/paciente'

export function AsignacionDashboard() {
  const [state, dispatch] = useReducer(
    asignacionReducer,
    INITIAL_ASIGNACION_STATE,
  )

  const user = useUser()

  const getPatients = useCallback(() => {
    dispatch({ type: 'setPatientsLoading' })
    getAllPatientsWithoutDoctor()
      .then((res) => dispatch({ type: 'setPatientsData', payload: res }))
      .catch((err) =>
        dispatch({ type: 'setPatientsError', payload: err.message }),
      )
  }, [])
  const getDoctors = useCallback(() => {
    dispatch({ type: 'setDoctorsLoading' })
    getAllDoctors()
      .then((res) => {
        dispatch({ type: 'setDoctorsData', payload: res })
      })
      .catch((err) =>
        dispatch({ type: 'setDoctorsError', payload: err.message }),
      )
  }, [])
  const setSelectedDoctor = useCallback((doctor) => {
    dispatch({ type: 'setAssignedData', payload: doctor.pacientes_asignados })
    dispatch({ type: 'setSelectedDoctor', payload: doctor })
  }, [])
  const assignPatient = useCallback(async ({ patient, doctor }) => {
    if (!patient || !doctor) return
    dispatch({ type: 'setAssignedLoading' })
    await assignPatientToDoctor(doctor, patient)
      .then(() => {
        dispatch({ type: 'assignPatient', payload: { patient, doctor } })
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : err.code ? err.code : err
        dispatch({ type: 'setPatientsError', payload: errorMessage })
      })
  }, [])
  const deassignPatient = useCallback(async ({ patient, doctor }) => {
    if (!patient || !doctor) return
    await deassignPatientToDoctor(doctor, patient)
      .then(() => {
        dispatch({ type: 'deassignPatient', payload: { patient, doctor } })
      })
      .catch((err) => {
        const errMessage = err instanceof Error ? err.message : err
        dispatch({ type: 'setAssignedError', payload: errMessage })
      })
  }, [])

  useEffect(() => {
    if (!user) return
    dispatch({ type: 'setAllLoading' })
    getPatients()
    getDoctors()
  }, [user])

  return (
    <div className={styles.grid}>
      {/* I could have done this with a map but now its too late */}
      <AsignacionDoctorsTable
        doctorsData={state.doctors}
        refetch={getDoctors}
        selectedDoctor={state.selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
      />
      <AsignacionPatientsTable
        patientsData={state.patients}
        refetchPatients={getPatients}
        selectedDoctor={state.selectedDoctor}
        assignPatient={assignPatient}
      />
      <AsignacionSelectedTable
        assignedData={state.assigned}
        deassignPatient={deassignPatient}
        selectedDoctor={state.selectedDoctor}
      />
    </div>
  )
}
