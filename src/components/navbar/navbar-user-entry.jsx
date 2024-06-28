import { useState } from 'react'
import styles from './navbar.module.css'
import { useUser } from '../../hooks/useUser'
import { DownArrowIcon } from '../icons/down-arrow'
import { NavbarUserModal } from './navbar-user-modal'

export function NavbarUserEntry() {
  const [open, setOpen] = useState(false)
  const user = useUser()

  if (!user) return null

  return (
    <div className={styles.userEntry}>
      <button
        onClick={() => {
          setOpen((prev) => !prev)
        }}
        className={styles.userEntry}>
        {user?.image?.src ? (
          <img
            className={styles.userImage}
            src={user.image.src}
            height={36}
            width={36}
          />
        ) : (
          <div className={styles.userImage + ' ' + styles.imagePlaceholder} />
        )}
        <span>
          {user.nombre} {user.apellido}
        </span>
        <DownArrowIcon
          width={10}
          style={{
            transition: 'rotate .1s ease-in-out',
            rotate: open ? '180deg' : '0deg',
          }}
        />
      </button>
      {open && <NavbarUserModal closeModal={() => setOpen(false)} />}
    </div>
  )
}
