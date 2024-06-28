import styles from './navbar.module.css'
import { Link } from 'react-router-dom'

export function NavbarEntry({ name, href, isSelected }) {
  return (
    <Link
      to={href}
      className={`${styles.entry} ${styles.noLogin} ${
        isSelected ? styles.selected : ''
      }`}
    >
      <span>{name}</span>
    </Link>
  )
}
