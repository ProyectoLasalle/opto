import { toast } from 'react-toastify'
import { tests } from '../../../utils/tests'
import { Test } from '../../tests/test'
import styles from './deberes-modal.module.css'
import { updateTest } from '../../../firebase/utils/paciente'

export function DeberesModal({ pageUser, setPageUser, closeModal }) {
  const handleClick = (slug) => {
    updateTest(pageUser.id, slug, pageUser.deberes, true).then(() => {
      setPageUser((prev) => ({
        ...prev,
        deberes: { ...prev.deberes, [slug]: true },
      }))
      toast('Se asignó correctamente el test al paciente')
      closeModal()
    })
  }

  return (
    <div className={styles.modalBackground} onClick={closeModal}>
      <section className={styles.section} onClick={(e) => e.stopPropagation()}>
        <h2>Asignar Tests</h2>
        <div className={styles.testsContainer}>
          {!pageUser?.deberes?.contraste && (
            <Test
              slug={tests.contraste.slug}
              onClick={handleClick}
              name={tests.contraste.name}
              desc={tests.contraste.desc}
            />
          )}
          {!pageUser?.deberes?.preferencial && (
            <Test
              slug={tests.preferencial.slug}
              onClick={handleClick}
              name={tests.preferencial.name}
              desc={tests.preferencial.desc}
            />
          )}
        </div>
      </section>
    </div>
  )
}
