import { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useLocation, matchPath } from 'react-router-dom'

/*  
    Este hook se encarga de toda la lógica de el archivo App.js, sobre todo del tema de las notificaciones.
    Cuando se entra en la página, se lee la propiedad notifications del usuario, y se despliegan ciertas
    modales si hay notificaciones pendientes.
*/

export function useAppLogic() {
  const [notifModalShowing, setNotifModalShowing] = useState(null)
  const [passwordShowing, setPasswordShowing] = useState(false)

  const { user, setUser } = useContext(UserContext)

  const location = useLocation()

  const isRouteAllowed = useMemo(() => {
    /*
      La ruta de las citas no está permitida porque no tendría sentido que se despliegue una modal
      de una cita viendo otra
    */
    const notAllowedRoutes = ['/:doctorId/:number/:appointmentId']
    return notAllowedRoutes.some((route) => {
      const match = matchPath(route, location.pathname)
      return match === null
    })
  })

  useEffect(() => {
    /* 
      Se encarga de leer la propiedad de notificaciones. 
      Está hecho de esta manera para que las modales se puedan presentar de manera infinita dependiendo
      de la cantidad de notificaciones que tenga el usuario
    */
    if (!user || !isRouteAllowed || notifModalShowing) return
    if (user.notifications?.length > 0) {
      setNotifModalShowing({
        type: user.notifications[0].type,
        // este params es el que después permite que el componente reciba sus props personalizadas para cada tipo de notif
        params: { ...user.notifications[0] },
      })
      setUser((prev) => {
        const newNotifications = [...prev.notifications]
        // se borra la notificación del estado local para que no se vuelva a mostrar
        newNotifications.shift()
        return { ...prev, notifications: newNotifications }
      })
    }
  }, [user, location.pathname, notifModalShowing])

  const closeModal = () => setPasswordShowing(false)
  const closeNotif = () => {
    setNotifModalShowing(null)
  }

  return { closeModal, closeNotif, user, passwordShowing, notifModalShowing }
}
