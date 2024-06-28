import styles from './navbar.module.css'
import { Link } from 'react-router-dom'

export function NavbarLoginEntry() {
  return (
    <Link to='/login' className={styles.entry + ' ' + styles.login}>
      <span>Login</span>
    </Link>
  )
}
