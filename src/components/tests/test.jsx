import { useModal } from 'hooks/useModal'
import { useUser } from '../../hooks/useUser'
import styles from './test.module.css'
import { HabeasDataTestsModal } from 'components/modals/habeas-data-tests-modal/habeas-data-tests-modal'

export function Test({
  name,
  desc,
  download,
  onClick,
  slug,
  deassign,
  src,
  habeasDataTestsAccepted,
  setHabeasDataTestsAccepted,
}) {
  const user = useUser()

  const { isOpen, closeModal, openModal } = useModal()

  const handleModal = (e) => {
    e.preventDefault()
    openModal()
  }

  const isNotPatient = user.role === 'admin' || user.role === 'doctor'

  return (
    <article className={styles.test1}>
      <header>{name}</header>
      <p>{desc}</p>
      <div className={styles.buttonsContainer}>
        {download ? (
          <>
            <a
              onClick={(e) =>
                isNotPatient || habeasDataTestsAccepted ? null : handleModal(e)
              }
              target='_blank'
              rel='noreferrer'
              href={src}>
              Descargar
            </a>
            {isNotPatient && (
              <button onClick={() => deassign(slug)}>Quitar</button>
            )}
          </>
        ) : (
          <button onClick={() => onClick(slug)}>Asignar</button>
        )}
      </div>
      {isOpen && (
        <HabeasDataTestsModal
          setHabeasDataTestsAccepted={setHabeasDataTestsAccepted}
          closeModal={closeModal}
          user={user}
        />
      )}
    </article>
  )
}
