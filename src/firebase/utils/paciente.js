import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { patientsCollection } from '../collections'
import { getUserRole } from '../auth'
import { updateUser } from './user'
import { db } from '../config'

export async function getPatientAvailableData(id) {
  const docRef = doc(patientsCollection, id)
  return await getDoc(docRef).then((doc) => {
    if (!doc.exists) throw new Error('El paciente no existe')
    const data = doc.data()

    return { deberes: data.deberes, historia_clinica: data.historia_clinica }
  })
}

export async function getAllPatientsWithoutDoctor() {
  if ((await getUserRole()) !== 'admin') throw new Error('No estás autorizado')

  return await getDocs(
    query(patientsCollection, where('medico_asignado', '==', null)),
  ).then((docs) => {
    if (docs.empty) return []

    const datas = docs.docs.map((doc) => {
      const id = doc.id
      const data = doc.data()

      return { ...data, id }
    })

    return datas
  })
}

export const updateTest = async (id, slug, deberes, assign = true) => {
  const role = await getUserRole()
  if (role !== 'admin' && role !== 'doctor')
    throw new Error('No estás autorizado')

  await updateUser({
    id,
    claim: 'patient',
    update: { deberes: { ...deberes, [slug]: assign } },
  })
}

export const getPatientTests = async (dni, test) => {
  // "test" corresponde al tipo de test: Terapia1 o Terapia2
  /*
    La estructura de las colecciones de terapias es un poco compleja, dentro de la coleccion hay documentos que corresponden a
    los dni's de los pacientes, y dentro de estos documentos hay subcolecciones que corresponden al conteo de las terapias
    del paciente (1, 2, 3, 4) estas subcolecciones contienen un documento que contiene los campos de los datos de esta terapia
  */

  // Se recupera la colección de terapias y se busca el documento que corresponde al dni del paciente
  const docRef = doc(collection(db, test), dni)
  // Es necesario recuperar los datos del documento para después iterar las claves y recuperar los datos de la subcolección
  const testDoc = await getDoc(docRef).then((doc) => {
    if (!doc.exists()) throw new Error('notfound')
    const data = doc.data()
    return data
  })

  /*
    Se itera sobre las claves del documento para recuperar los datos de la subcolección
    Es importante que en esta parte se está iterando sobre las claves (como cámpos) del documento, que están ahí
    como índices para saber cuales son las subcolecciones disponibles, no sobre los datos de la subcolección en sí
    se hace esto porque firebase no ofrece una forma idónea de iterar sobre subcolecciones dentro de un documento
  */

  // eslint-disable-next-line no-unused-vars
  const promises = Object.entries(testDoc).map(async ([_, value]) => {
    // ^ Se itera con un map para después devolver los valores de la iteración en un array de promesas que se resuelven
    // con los datos de la subcolección
    const [doc] = await getDocs(collection(docRef, value)).then((docs) => {
      // Dentro del map se tiene que hacer otra llamada asíncrona para obtener los datos de la subcolección
      if (docs.empty) {
        throw new Error('No se encontró el documento')
      }
      return docs.docs.flatMap((doc) => {
        const id = doc.id
        const data = doc.data()
        return { ...data, id, test, ref: doc.ref }
      })
    })
    return doc
  })

  // Se devuelve la lista de promesas
  return Promise.all(promises)
}

export const deletePatientTests = async (dni) => {
  if (!dni) return
  const tests = ['Terapia1', 'Terapia2']

  const mainPromises = tests.map(async (test) => {
    const docRef = doc(db, test, dni)
    const docSnapshot = await getDoc(docRef)
    const testDoc = docSnapshot.data()

    if (!testDoc) return null

    const promises = Object.values(testDoc).map(async (value) => {
      // eslint-disable-line no-unused-vars
      const docs = await getDocs(collection(docRef, value))
      const deletePromises = docs.docs.map(async (doc) => {
        await deleteDoc(doc.ref)
      })
      return await Promise.all(deletePromises)
    })

    return await Promise.all(promises)
  })

  return Promise.all(mainPromises)
}

export const addNoteToTest = (testRef, note, user) => {
  return updateDoc(testRef, {
    notes: arrayUnion({ note, user, date: Date.now() }),
  })
}
export const deleteNoteToTest = (testRef, note) => {
  return updateDoc(testRef, {
    notes: arrayRemove(note),
  })
}
