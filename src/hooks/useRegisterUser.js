import { useCallback, useState } from 'react'
import { auth } from '../firebase/config'
import { updateUser, uploadImage } from '../firebase/utils/user'
import { API_ADMIN_URL } from '../utils/prod-dev-variables'
import { toast } from 'react-toastify'
import { roleToUserDict } from '../utils/role-to-user-dict'

export function useRegisterUser() {
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = useCallback((e) => {
    const files = e.target.files
    if (!(files != null && files.length > 0)) return

    const url = URL.createObjectURL(files[0])
    setImage({ file: files[0], url })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Se setean los estados iniciales
    setLoading(true)
    setError(null)

    // Se recuperan los datos del formulario
    const data = new FormData(e.target)
    const values = Object.fromEntries(data)

    const token = await auth.currentUser.getIdToken(true)
    try {
      const user = await fetch(API_ADMIN_URL, {
        body: JSON.stringify({ ...values }),
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) throw new Error(json.error)
          return json
        })

      if (image && user) {
        const imageData = await uploadImage({
          file: image.file,
          id: user.id,
        })
        await updateUser({
          id: user.id,
          claim: user.role,
          update: { image: imageData },
        })
      }

      toast(
        `Se creó con exito el ${roleToUserDict[values.role]} ${user.nombre} ${
          user.apellido
        }`,
      )
      e.target.reset()
      setImage(null)
    } catch (err) {
      const errMessage =
        err instanceof Error
          ? err.message
          : 'Hubo un error al crear el ' + roleToUserDict[values.role]
      setError(errMessage)
      toast.error(errMessage)
    } finally {
      setLoading(false)
    }
  }

  return { handleSubmit, handleImage, setImage, image, error, loading }
}
