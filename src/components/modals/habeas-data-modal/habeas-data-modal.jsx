import { useCallback, useEffect, useState } from 'react'
import { ModalBackground } from '../../common/modal-background/modal-background'
import styles from './habeas-data-modal.module.css'
import { deleteHabeasDataNotification } from '../../../firebase/utils/user'
import { useUser } from '../../../hooks/useUser'
import { DeclineModal } from '../decline-modal/decline-modal'

export function HabeasDataModal({ closeModal }) {
  const [declining, setDeclining] = useState(false)

  useEffect(() => {
    if (!document) return
    const nav = document.querySelector('nav')

    nav.style.pointerEvents = 'none'

    return () => {
      nav.style.pointerEvents = 'auto'
    }
  }, [])

  const user = useUser()

  const handleAccept = useCallback(() => {
    deleteHabeasDataNotification({
      userId: user.id,
      role: user.role,
    }).then(closeModal)
  }, [user])

  return !declining ? (
    <ModalBackground closeModal={() => {}} onClick={() => {}}>
      <div className={styles.modal}>
        <h4>Habeas Data</h4>
        <p>
          Autorizo de manera previa, expresa, libre, voluntaria y debidamente
          informada a la Universidad de La Salle, a hacer uso de mis datos
          personales (Rol, nombre, apelliido, documento, edad, ocupación,
          dirección, teléfono, nombre del acudiente (para niños), teléfono del
          acudiente (para niños), fecha del ultimo control, correo electrónico y
          contraseña), los cuales son recolectados con la finalidad de prestar
          los servicios de salud visual, acorde con las directrices establecidas
          en el Capítulo 25 del Decreto 1074 de 2015, que reglamenta la Ley 1581
          de 2012 sobre Protección de Datos Personales y el Acuerdo 002 de 2018
          del Consejo Superior por el cual se actualiza la Política de
          Tratamiento de Información Personal de la Universidad de La Salle la
          cual está disponible para consulta en el sitio web www.lasalle.edu.co.
          Mis derechos como titular de los datos podrán ser ejercidos a través
          del correo electrónico habeasdata@lasalle.edu.co
        </p>

        <p className={styles.textAccept}>
          Al aceptar estás de acuerdo con lo descrito en el texto anterior.
        </p>

        <button onClick={handleAccept} className={styles.submit}>
          Aceptar
        </button>

        <button onClick={() => setDeclining(true)} className={styles.decline}>
          Rechazar
        </button>
      </div>
    </ModalBackground>
  ) : (
    <DeclineModal
      user={user}
      closeModal={() => setDeclining(false)}
      closeHabeasDataModal={() => closeModal()}
    />
  )
}
