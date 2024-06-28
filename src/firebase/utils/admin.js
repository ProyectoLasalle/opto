import { storage } from '../config'
import { ref, uploadBytes } from 'firebase/storage'
import { patientsCollection } from '../collections'
import { getUserRole } from '../auth'
import { getDocs } from 'firebase/firestore'

// Upload files
// Upload Profile Picture
export async function setAdminProfilePic(uid, file) {
  try {
    const imageRef = ref(storage, `fotos-admins/${uid}`)
    const resUpload = await uploadBytes(imageRef, file)
    return resUpload
  } catch (error) {
    console.error('Error al subir archivo: ' + error)
  }
}

export async function getAllPatients() {
  if ((await getUserRole()) !== 'admin') throw new Error('No estás autorizado')

  return await getDocs(patientsCollection).then((docs) => {
    if (docs.empty) return []

    const datas = docs.docs.map((doc) => {
      const id = doc.id
      const data = doc.data()

      return { ...data, id }
    })

    return datas
  })
}
