import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  adminCollection,
  doctorsCollection,
  patientsCollection,
} from '../collections'
import { auth, storage } from '../config'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { deletePatientTests } from './paciente'
import { API_ADMIN_URL } from '../../utils/prod-dev-variables'
import { deassignAllPatientsToDoctor, deassignPatient } from './medicos'
import Compressor from 'compressorjs'
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from 'firebase/auth'

export const getCollection = (claim) => {
  switch (claim) {
    case 'admin':
      return adminCollection
    case 'doctor':
      return doctorsCollection
    case 'patient':
      return patientsCollection
    default:
      throw new Error('No se encontró la colección.')
  }
}

export const getUser = async (id, claim) => {
  const collection = getCollection(claim)
  const docRef = doc(collection, id)

  return getDoc(docRef).then((doc) => {
    if (!doc.exists()) {
      throw new Error('No se encontró el usuario.')
    }
    const id = doc.id
    const data = doc.data()
    return { ...data, id }
  })
}
export const updateUser = async ({ id, claim, update }) => {
  const collection = getCollection(claim)

  const docRef = doc(collection, id)
  return updateDoc(docRef, update)
}

const compressImage = ({ file, width, height, quality = 0.8 }) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: quality,
      height,
      width,
      resize: 'contain',

      beforeDraw(context, canvas) {
        context.fillStyle = '#000'
        context.fillRect(0, 0, canvas.width, canvas.height)
      },

      success(result) {
        resolve(result)
      },

      error(err) {
        reject(err)
      },
    })
  })
}

export const uploadImage = async ({ id, file }) => {
  // Se genera un nombre único para la imágen, para que no se sobreescriba.
  const fileName = String(Date.now()) + '.' + file.name.split('.')[1]
  const path = 'profilePics'
  const imageRef = ref(storage, `/${path}/${id}/${fileName}`)

  // La imágen se comprime para que ocupe menos, y como nunca se va a mostrar como una imágen grande,
  // no importa que pierda calidad.
  const mainImage = await compressImage({ file, height: 300, width: 300 })

  try {
    await uploadBytesResumable(imageRef, mainImage)

    const imageUrl = await getDownloadURL(imageRef)

    return { src: imageUrl, path: imageRef.fullPath }
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Hubo un error al subir la imágen, inténtalo denuevo.'

    // Este error después se handlea en el componente.
    throw new Error(errorMessage)
  }
}

export const deleteImage = async (oldPath) => {
  const imageRef = ref(storage, oldPath)

  return deleteObject(imageRef)
}

export const cerrarSesion = async () => {
  return await auth.signOut()
}

export const deleteUser = async (user) => {
  if (!user) return

  if (user.role === 'patient') {
    await deletePatientTests(user.documento)
    if (user.medico_asignado !== null) {
      await deassignPatient(user.medico_asignado, user)
    }
  } else if (user.role === 'doctor') {
    if (user.pacientes_asignados.length > 0) {
      await deassignAllPatientsToDoctor(user)
    }
  }
  const token = await auth.currentUser.getIdToken(true)

  return fetch(API_ADMIN_URL, {
    method: 'DELETE',
    body: JSON.stringify({ userToModify: user }),
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  })
}

export const recoverPassword = async (email) => {
  await fetchSignInMethodsForEmail(auth, email).then((signInMethods) => {
    if (signInMethods.length === 0) {
      throw new Error('El correo electronico no está registrado.')
    }
  })
  return sendPasswordResetEmail(auth, email)
}

export const deleteHabeasDataNotification = async ({ userId, role }) => {
  const collection = getCollection(role)

  const userRef = doc(collection, userId)

  const userData = await getDoc(userRef).then((snap) => snap.data())

  const newNotifications = userData.notifications.filter(
    (notif) => notif.type !== 'habeas-data-login',
  )
  return updateDoc(userRef, {
    notifications: newNotifications,
    habeasDataLoginAccepted: true,
  })
}

export const deleteUserPasswordChangeNotification = async ({
  userId,
  role,
}) => {
  const collection = getCollection(role)

  const userRef = doc(collection, userId)

  const userData = await getDoc(userRef).then((snap) => snap.data())

  const newNotifications = userData.notifications.filter(
    (notif) => notif.type !== 'change-password',
  )
  return updateDoc(userRef, { notifications: newNotifications })
}

export const deleteUserAppointmentNotification = async ({
  userId,
  role,
  id,
}) => {
  const collection = getCollection(role)

  const userRef = doc(collection, userId)

  const user = await getDoc(userRef).then((snap) => snap.data())

  const newNotifications = user.notifications.filter((notif) => notif.id !== id)
  return updateDoc(userRef, { notifications: newNotifications })
}

export const setHabeasDataTestsAcceptance = async ({ userId, role }) => {
  const collection = getCollection(role)

  const userRef = doc(collection, userId)

  return updateDoc(userRef, {
    habeasDataTestsAccepted: true,
  })
}

export const verifyUserCredentials = async (email, password) => {
  // eslint-disable-next-line no-undef
  const apiKey = process.env.REACT_APP_API_KEY
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`

  const data = {
    email: email,
    password: password,
    returnSecureToken: false,
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error.message)
    }

    return await res.json()
  } catch (error) {
    console.error('Error verificando credenciales:', error.message)
  }
}
