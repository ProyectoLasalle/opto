import { toast } from 'react-toastify'
import { useUser } from '../../hooks/useUser'
import { tests } from '../../utils/tests'
import { Test } from './test'
import styles from './test.module.css'
import { updateTest } from '../../firebase/utils/paciente'
import { useState } from 'react'
import { useEffect } from 'react'

export function TestsAsignadosSection({ pageUser, setPageUser, openModal }) {
  const user = useUser()
  const [habeasDataTestsAccepted, setHabeasDataTestsAccepted] = useState(false)

  useEffect(() => {
    setHabeasDataTestsAccepted(user?.habeasDataTestsAccepted)
  }, [user])

  const deassign = (slug) => {
    updateTest(pageUser.id, slug, pageUser.deberes, false).then(() => {
      setPageUser((prev) => ({
        ...prev,
        deberes: { ...prev.deberes, [slug]: false },
      }))
      toast('Se desasignó correctamente el test al usuario')
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.titleContainer}>
        <h1>Tests Asignados</h1>
        {(user.role === 'admin' || user.role === 'doctor') &&
          pageUser &&
          Object.values(pageUser.deberes).some((el) => !el) && (
            <button onClick={openModal}>Asignar</button>
          )}
      </div>
      {pageUser &&
        Object.values(pageUser?.deberes || { _: false }).every((el) => !el) && (
          <span style={{ textAlign: 'center' }}>
            No hay deberes asignados para este usuario
          </span>
        )}
      <div className={styles.testsContainer}>
        {pageUser?.deberes?.contraste && (
          <Test
            slug={tests.contraste.slug}
            download
            deassign={deassign}
            name={tests.contraste.name}
            desc={tests.contraste.desc}
            src={tests.contraste.src}
            habeasDataTestsAccepted={habeasDataTestsAccepted}
            setHabeasDataTestsAccepted={setHabeasDataTestsAccepted}
          />
        )}
        {pageUser?.deberes?.preferencial && (
          <Test
            slug={tests.preferencial.slug}
            download
            deassign={deassign}
            name={tests.preferencial.name}
            desc={tests.preferencial.desc}
            src={tests.preferencial.src}
            habeasDataTestsAccepted={habeasDataTestsAccepted}
            setHabeasDataTestsAccepted={setHabeasDataTestsAccepted}
          />
        )}
      </div>
    </section>
  )
}
