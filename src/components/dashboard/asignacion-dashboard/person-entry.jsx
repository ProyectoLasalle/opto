import styles from './asignacion-dashboard.module.css'

export function PersonEntry({ children, ...props }) {
  return (
    <div className={styles.person} {...props}>
      {children}
    </div>
  )
}
