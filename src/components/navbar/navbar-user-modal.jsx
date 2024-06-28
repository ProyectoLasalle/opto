import { Link } from 'react-router-dom'
import styles from './navbar.module.css'
import { cerrarSesion } from '../../firebase/utils/user'
import { useUser } from '../../hooks/useUser'

export function NavbarUserModal({ closeModal }) {
  const user = useUser()
  const handleClick = () => {
    cerrarSesion().then(closeModal)
  }
  const magicString =
    user.role === 'patient'
      ? 'paciente'
      : user.role === 'doctor'
      ? 'profesional'
      : 'admin'
  return (
    <div className={styles.userModal}>
      <Link to={`/${magicString}/${user.id}`} onClick={closeModal}>
        Mi perfil
      </Link>
      <button onClick={handleClick}>Cerrar Sesión</button>
    </div>
  )
}
