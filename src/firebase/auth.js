import { signInWithEmailAndPassword } from 'firebase/auth'
import { USER_POSSIBLE_STATES } from '../utils/user-possible-states'
import { auth } from './config'
import { cerrarSesion, getUser } from './utils/user'
import { toast } from 'react-toastify'
import { API_PUBLIC_URL } from 'utils/prod-dev-variables'

export async function getUserRole() {
  return await new Promise((resolve, reject) => {
    if (auth.currentUser === null) resolve(USER_POSSIBLE_STATES.NOT_LOGGED)
    auth.currentUser
      ?.getIdTokenResult()
      .then((idTokenResult) => {
        resolve(idTokenResult.claims['role'])
      })
      .catch(reject)
  })
}

export const onAuthStateChanged = async (setState) => {
  return auth.onAuthStateChanged(async (user) => {
    if (user === null) {
      setState(USER_POSSIBLE_STATES.NOT_LOGGED)
      return
    }
    try {
      const role = await getUserRole()

      if (!role) setState(USER_POSSIBLE_STATES.NOT_LOGGED)
      const userFromFirestore = await getUser(user.uid, role)

      // idTokenResult es necesario para obtener el auth_time, que es la fecha en segundos en la que se autentico el usuario
      const idTokenResult = await user.getIdTokenResult()

      const authTime = idTokenResult.claims.auth_time * 1000 // Lo convierte a milisegundos
      const sessionDuration = 1000 * 60 * 60 * 24 // Un día en milisegundos
      const now = Date.now()

      // Si la fecha actual menos la fecha en la que se autentico el usuario es mayor a la duración de la sesión,
      // se cierra la sesión
      if (now - authTime > sessionDuration) {
        cerrarSesion()
        setState(USER_POSSIBLE_STATES.NOT_LOGGED)
        toast.error('Tu sesión ha expirado, por favor inicia sesión de nuevo.')
        return
      }

      if (!userFromFirestore.active) {
        await cerrarSesion()
        setState(USER_POSSIBLE_STATES.NOT_LOGGED)
        toast.error('Tu cuenta esta desactivada, no puedes iniciar sesión.')
        return
      }

      setState({ ...userFromFirestore, role })
    } catch (err) {
      setState(USER_POSSIBLE_STATES.NOT_LOGGED)
    }
  })
}

export const iniciarSesion = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const sendVerificationCode = async ({
  email,
  displayName,
  code,
  idToken,
}) => {
  try {
    await fetch(API_PUBLIC_URL, {
      body: JSON.stringify({
        email,
        name: displayName,
        verificationCode: code,
      }),
      headers: {
        Authorization: 'Bearer ' + idToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  } catch (error) {
    console.error('Error al enviar el código de verificación:', error)
    throw error
  }
}
