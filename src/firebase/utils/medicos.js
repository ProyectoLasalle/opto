import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { getUserRole } from '../auth'
import { doctorsCollection, patientsCollection } from '../collections'

export async function getAllDoctors() {
  if ((await getUserRole()) !== 'admin') throw new Error('No estás autorizado')

  return await getDocs(doctorsCollection).then((docs) => {
    if (docs.empty) return []

    const datas = docs.docs.map((doc) => {
      const id = doc.id
      const data = doc.data()

      return { ...data, id }
    })

    return datas
  })
}

const sanitizeDoctor = (doctor) => {
  // eslint-disable-next-line no-unused-vars
  const { pacientes_asignados, notifications, telefono, ...rest } = doctor
  return rest
}

export async function assignPatientToDoctor(selectedDoctor, patient) {
  if (!selectedDoctor || !patient) return
  if ((await getUserRole()) !== 'admin') throw new Error('No estás autorizado')

  const docRef = doc(doctorsCollection, selectedDoctor.id)
  const patientRef = doc(patientsCollection, patient.id)

  const docToAdd = sanitizeDoctor(selectedDoctor)

  const docPromise = updateDoc(docRef, {
    pacientes_asignados: arrayUnion(patient),
  })
  const patientPromise = updateDoc(patientRef, {
    medico_asignado: docToAdd,
  })

  return Promise.all([docPromise, patientPromise])
}

export async function deassignPatientToDoctor(selectedDoctor, patient) {
  if (!selectedDoctor || !patient) return
  if ((await getUserRole()) !== 'admin') throw new Error('No estás autorizado')

  const docRef = doc(doctorsCollection, selectedDoctor.id)
  const patientRef = doc(patientsCollection, patient.id)

  const docPromise = updateDoc(docRef, {
    pacientes_asignados: arrayRemove(patient),
  })
  const patientPromise = updateDoc(patientRef, {
    medico_asignado: null,
  })

  return Promise.all([docPromise, patientPromise])
}

export async function deassignAllPatientsToDoctor(doctor) {
  if (!doctor) return
  if ((await getUserRole()) !== 'admin') throw new Error('No estás autorizado')

  const promises = doctor.pacientes_asignados.map((patient) => {
    const patientRef = doc(patientsCollection, patient.id)

    return updateDoc(patientRef, { medico_asignado: null })
  })

  return Promise.all(promises)
}

export async function deassignPatient(doctor, patient) {
  console.log({ doctor, patient })

  const docRef = doc(doctorsCollection, doctor.id)

  const docSnapshot = await getDoc(docRef)
  const exists = docSnapshot.exists()
  if (!exists) throw new Error('No se encontró el doctor.')
  else {
    const data = docSnapshot.data()
    const array = data.pacientes_asignados
    const patientField = array.find((obj) => obj.id === patient.id)

    return await updateDoc(docRef, {
      pacientes_asignados: arrayRemove(patientField ?? ''),
    })
  }
}
