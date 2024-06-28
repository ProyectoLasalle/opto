import styles from './test-home-modal.module.css'
import { useModalLogic } from '../../../hooks/useModalLogic'
import { CloseIcon } from '../../icons/close'

const PreferencialRender = () => (
  <>
    <img src='/preferencial.png' height={200} width={200} />
    <h4>Test de Mirada Preferencial</h4>
    <p>
      La evaluación de la agudeza visual en niños hasta los dos o tres años se
      realiza con el fin de determinar la máxima capacidad de resolución de su
      sistema visual bajo condiciones de poca colaboración, para esto
      clínicamente se utiliza el test de mirada preferencial que tiene en cuenta
      la preferencia visual para dirigir la mirada hacia un patrón especial
      sobre otro sencillo.
    </p>
  </>
)
const ContrasteRender = () => (
  <>
    <img src='/contraste.png' height={200} width={200} />
    <h4>Test de Sensibilidad al Contraste</h4>
    <p>
      La sensibilidad al contraste es la capacidad de una persona para detectar
      o identificar la presencia de mínimas diferencias de luminosidad en
      objetos o áreas.
    </p>
    <p>
      La evaluación de la sensibilidad al contraste permite determinar el menor
      contraste que el sistema visual puede detectar. La sensibilidad al
      contraste evalúa subjetivamente la función visual a través de la
      percepción de las frecuencias espaciales (tamaño) y contraste.
    </p>
  </>
)

export function TestHomeModal({ closeModal, animating, modalOpen }) {
  useModalLogic({ closeModal, scroll: true })

  return (
    <div className={`${styles.modalBackground}`} onClick={closeModal}>
      <div
        className={`${styles.modal} ${animating ? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <button onClick={closeModal} className={styles.close}>
            <CloseIcon height={35} width={35} />
          </button>
          <img src='/logo.webp' height={45} />
        </header>
        <div className={styles.body}>
          {modalOpen === 'preferencial' ? (
            <PreferencialRender />
          ) : (
            <ContrasteRender />
          )}
        </div>
      </div>
    </div>
  )
}
