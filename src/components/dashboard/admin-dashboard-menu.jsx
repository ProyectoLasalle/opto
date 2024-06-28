import { Link, useLocation } from 'react-router-dom'
import styles from './admin-dashboard.module.css'

export function AdminDashboardMenu() {
  const location = useLocation()
  return (
    <header className={styles.menu}>
      <Link
        className={`${styles.menuEntry} ${
          location.pathname === '/dashboard/asignacion' ? styles.selected : ''
        }`}
        to='/dashboard/asignacion'>
        Asignación de pacientes
      </Link>
      <Link
        className={`${styles.menuEntry} ${
          location.pathname === '/dashboard/register' ? styles.selected : ''
        }`}
        to='/dashboard/register'>
        Registrar usuario
      </Link>
    </header>
  )
}
