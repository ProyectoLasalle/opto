/* eslint-disable no-unused-vars */
import { trimStart } from 'utils/trim'
import { db } from '../config'
import {
  DocumentReference,
  deleteDoc,
  deleteField,
  doc,
  updateDoc,
} from 'firebase/firestore'

/**
 *
 * @param {DocumentReference} ref
 * @returns {Promise<void>}
 */

export const deleteResult = async (ref) => {
  const completePath = ref.path
  const splitPath = completePath.split('/')

  const docRef = doc(db, splitPath[0], splitPath[1])
  // Hay que eliminar el campo que enumera las colecciones de resultados dentro de la colección del usuario
  // path: {Terapia1 | Terapia2}/{id}/{indice}/{collectionId}/
  await updateDoc(docRef, {
    [trimStart(splitPath[2], '0')]: deleteField(),
  })

  return await deleteDoc(ref)
}
