import styles from './home.module.css'

export function Circle({ color, style, width, height }) {
  return (
    <div className={`${styles.circleContainer} ${styles[color]}`} style={style}>
      <div className={styles.circleWrapper}>
        <div
          className={`${styles.circle} ${styles[color]}`}
          style={{ height, width }}
        />
      </div>
    </div>
  )
}
