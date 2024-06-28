import { Circle } from './circle'
import styles from './home.module.css'

export function HowItWorksSection({ setModalOpen }) {
  return (
    <section className={styles.how}>
      <h2>¿Cómo funciona?</h2>
      <p>Tenemos dos tipos de tests</p>
      <div className={styles.tests}>
        <div
          className={styles.test}
          onClick={() => setModalOpen('preferencial')}>
          <img src='/preferencial.png' />
          <div className={styles.testData}>
            <h5>Mirada Preferencial</h5>
            <p>Haz click para saber más</p>
          </div>
        </div>
        <div className={styles.test} onClick={() => setModalOpen('contraste')}>
          <img src='/contraste.png' />
          <div className={styles.testData}>
            <h5>Sensibilidad al Contraste</h5>
            <p>Haz click para saber más</p>
          </div>
        </div>
      </div>
      <Circle color='blue' style={{ top: '1rem', left: '-2rem' }} />
      <Circle
        color='blue'
        style={{ top: '40%', left: '-2rem' }}
        height={290}
        width={290}
      />
      <Circle
        color='yellow'
        style={{ bottom: '-5%', right: '-5%' }}
        height={300}
        width={300}
      />
      <Circle
        color='blue'
        style={{ bottom: '-15%', right: '-25%' }}
        height={300}
        width={300}
      />
    </section>
  )
}
