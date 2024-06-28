import styles from './spinner.module.css'

export function Spinner({ style }) {
  return <div id='spinner' style={style} className={styles.spinner}></div>
}
