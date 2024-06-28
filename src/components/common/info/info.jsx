import styles from './info.module.css'

export function Info() {
  return (
    <div className={styles.info}>
      <p>?</p>
      <div className={styles.container}>
        <div className={styles.data}>
          <p>
            Los &ldquo;v&ldquo; Corresponden a los resultados del ojo izquierdo
            y los &ldquo;R&ldquo; corresponden a los del ojo derecho, ambos
            deberían coincidir.
          </p>
        </div>
      </div>
    </div>
  )
}
