import styles from './home.module.css'
import { DataEntry } from './data-entry'
import { ImageEntry } from './image-entry'
import { HowItWorksSection } from './how-it-works-section'
import { useState } from 'react'
import { TestHomeModal } from '../../components/modals/test-home-modal/test-home-modal'

const entrys = [
  {
    num: 1,
    title: 'Prueba tu visión con nuestro test de sensibilidad al contraste.',
    image: '/home/face.jpg',
    aspectRatio: '1000/800',
    template: '1fr .65fr',
    desc: 'Descubre tu capacidad para detectar patrones y resalta tu agudeza visual. Nuestra prueba de sensibilidad al contraste revela información diagnóstica clave para condiciones clínicas como glaucoma, ambliopía y degeneración macular. No dejes que la pérdida de contraste afecte tu visión, ¡descubre cómo mejorarla hoy mismo!',
  },
  {
    num: 2,
    title: 'La herramienta más completa en terapia visual',
    image: '/home/face.jpg',
    aspectRatio: '1000/800',
    desc: '15470 pacientes ya la han utilizado.',
  },
]

export const Home = () => {
  const [modalOpen, setModalOpen] = useState(null)
  const [modalAnimating, setModalAnimating] = useState(false)

  const closeModal = () => {
    if (modalAnimating) return
    setModalAnimating(true)
    setTimeout(() => {
      setModalOpen(null)
      setModalAnimating(false)
    }, 250)
  }

  return (
    <>
      <main className={styles.header}>
        <div
          className={`${styles.viewContainer}`}
          style={{ gridTemplateColumns: entrys[1].template }}
          key={entrys[1].num}>
          <section className={styles.dataSection}>
            <DataEntry {...entrys[1]} />
          </section>
          <ImageEntry {...entrys[1]} />
          <div className={styles.outterCircle} />
          <div className={styles.innerCircle} />
        </div>
        <HowItWorksSection
          setModalOpen={setModalOpen}
          closeModal={closeModal}
        />
      </main>
      {modalOpen && (
        <TestHomeModal
          modalOpen={modalOpen}
          animating={modalAnimating}
          closeModal={closeModal}
        />
      )}
    </>
  )
}
