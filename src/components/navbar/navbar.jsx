import { useLocation } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { USER_POSSIBLE_STATES } from '../../utils/user-possible-states'
import { NavbarEntry } from './navbar-entry'
import { NavbarLoginEntry } from './navbar-login-entry'
import styles from './navbar.module.css'
import { NavbarUserEntry } from './navbar-user-entry'
import { useMemo } from 'react'

const adminEntrys = [
  { name: 'Pacientes', includes: '/pacientes', href: '/pacientes' },
  { name: 'Dashboard', includes: '/dashboard', href: '/dashboard/asignacion' },
]

export function Navbar() {
  const user = useUser()
  const entrys = useMemo(() => {
    if (
      user === USER_POSSIBLE_STATES.NOT_KNOWN ||
      USER_POSSIBLE_STATES.NOT_LOGGED
    )
      return []
    if (user?.role === 'admin') return adminEntrys
    if (user?.role === 'doctor')
      return [
        { name: 'Pacientes', includes: '/pacientes', href: '/pacientes' },
        {
          name: 'Calendario de citas',
          includes: '/calendario',
          href: `/profesional/${user.id}/calendario`,
        },
      ]
    if (user?.role === 'patient')
      return [
        {
          name: 'Progreso',
          includes: `/resultados`,
          href: `/paciente/${user.id}/resultados`,
        },
        {
          name: 'Calendario de citas',
          includes: '/calendario',
          href: `/paciente/${user.id}/calendario`,
        },
      ]
    return []
  })

  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <img className='' src='/logo.webp' height={35} />
      <div className={styles.entrysContainer}>
        <NavbarEntry name='Inicio' href='/' isSelected={pathname === '/'} />
        {entrys.map((el) => (
          <NavbarEntry
            key={el.name}
            {...el}
            isSelected={pathname.includes(el.includes)}
          />
        ))}
      </div>
      <div className={styles.loginContainer}>
        {user === USER_POSSIBLE_STATES.NOT_LOGGED ? (
          <NavbarLoginEntry />
        ) : (
          <NavbarUserEntry />
        )}
      </div>
    </nav>
  )
}
