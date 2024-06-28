export const INITIAL_ASIGNACION_STATE = {
  doctors: {
    data: null,
    error: null,
    loading: true,
  },
  patients: {
    data: null,
    error: null,
    loading: true,
  },
  assigned: {
    data: null,
    error: null,
    loading: false,
  },
  selectedDoctor: null,
  selectedPatient: null,
}

export function asignacionReducer(state, action) {
  switch (action.type) {
    case 'setAllLoading':
      return {
        ...state,
        doctors: { ...state.doctors, loading: true },
        patients: { ...state.patients, loading: true },
        assigned: { ...state.assigned, loading: true },
      }
    case 'setDoctorsData':
      return {
        ...state,
        doctors: { error: null, loading: false, data: action.payload },
      }
    case 'setDoctorsLoading':
      return { ...state, doctors: { error: null, loading: true, data: null } }
    case 'setDoctorsError':
      return {
        ...state,
        doctors: { error: action.payload, loading: false, data: null },
      }
    case 'setPatientsData':
      return {
        ...state,
        patients: { error: null, loading: false, data: action.payload },
      }
    case 'setPatientsLoading':
      return {
        ...state,
        patients: { ...state.assigned, error: null, loading: true },
      }
    case 'setPatientsError':
      return {
        ...state,
        patients: { error: action.payload, loading: false, data: null },
        assigned: { ...state.assigned, loading: false }
      }
    // case 'removePatientFromPatients':
    //   return { ...state, patients: { error: null, loading: false, data: state.patients.data.filter(el => el.id !== action.payload) } }
    case 'addToPatients':
      return {
        ...state,
        patients: {
          error: null,
          loading: false,
          data:
            state.patients.data !== null
              ? state.patients.data.concat(action.payload)
              : [action.payload],
        },
      }
    case 'setAssignedData':
      return {
        ...state,
        assigned: { error: null, loading: false, data: action.payload },
      }
    case 'removePatientFromAssigned':
      return {
        ...state,
        assigned: {
          error: null,
          loading: false,
          data: state.assigned.data.filter((el) => el.id !== action.payload),
        },
      }

    case 'assignPatient':
      const assign_doctors = [...state.doctors.data]
      const doctorGettingAssignedIndex = assign_doctors.findIndex(
        (el) => el.id === action.payload.doctor.id,
      )
      if (doctorGettingAssignedIndex > -1) {
        if (
          !assign_doctors[
            doctorGettingAssignedIndex
          ]?.pacientes_asignados?.some(
            (el) => el.id === action.payload.patient.id,
          )
        ) {
          assign_doctors[doctorGettingAssignedIndex].pacientes_asignados =
            assign_doctors[
              doctorGettingAssignedIndex
            ].pacientes_asignados.concat(action.payload.patient)
        }
      }
      return {
        ...state,
        doctors: {
          ...state.doctors,
          data: assign_doctors,
        },
        patients: {
          ...state.patients,
          data: state.patients.data.filter(
            (el) => el.id !== action.payload.patient.id,
          ),
        },
        assigned: {
          error: null,
          loading: false,
          data:
            state.assigned.data !== null
              ? state.assigned.data.concat(action.payload.patient)
              : [action.payload.patient],
        },
      }
    case 'deassignPatient':
      const deassign_doctors = [...state.doctors.data]
      const doctorGettingDeassignedIndex = deassign_doctors.findIndex(
        (el) => el.id === action.payload.doctor.id,
      )
      if (doctorGettingDeassignedIndex > -1) {
        deassign_doctors[doctorGettingDeassignedIndex].pacientes_asignados =
          deassign_doctors[
            doctorGettingDeassignedIndex
          ].pacientes_asignados.filter(
            (el) => el.id !== action.payload.patient.id,
          )
      }
      return {
        ...state,
        doctors: {
          ...state.doctors,
          data: deassign_doctors,
        },
        patients: {
          ...state.patients,
          data: state.patients.data.concat(action.payload.patient),
        },
        assigned: {
          error: null,
          loading: false,
          data:
            state.assigned.data !== null
              ? state.assigned.data.filter(
                  (el) => el.id !== action.payload.patient.id,
                )
              : [action.payload.patient],
        },
      }
    case 'setAssignedLoading':
      return {
        ...state,
        assigned: { ...state.assigned, error: null, loading: true },
      }
    case 'setAssignedError':
      return {
        ...state,
        assigned: {...state.assigned, error: action.payload, loading: false}
      }
    case 'setSelectedDoctor':
      return { ...state, selectedDoctor: action.payload }
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}
