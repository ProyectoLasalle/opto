import { UserImage } from '../../common/entry-placeholder/user-image/user-image'
import { formatDate } from '../../../utils/format-date'
import styles from './notes-modal.module.css'
import { useUser } from '../../../hooks/useUser'
import { DeleteIcon } from '../../icons/delete'
import { useContext } from 'react'
import { ResultsContext } from '../../../contexts/ResultsContext'

export function Note({ note, date, user }) {
  const loggedUser = useUser()
  const { dispatch } = useContext(ResultsContext)

  return (
    <article className={styles.note}>
      <header>
        <div className={styles.data}>
          <UserImage src={user.image?.src} />
          <p>
            {user.nombre} {user.apellido}
          </p>
          <p className={styles.date}>{formatDate(date) || null}</p>
          {(loggedUser.role === 'doctor' || loggedUser.role === 'admin') && (
            <button
              className={styles.delete}
              onClick={() =>
                dispatch({
                  type: 'openDeleting',
                  payload: { note, date, user },
                })
              }>
              <DeleteIcon style={{ height: 22, width: 22 }} />
            </button>
          )}
        </div>
      </header>
      <div className={styles.body}>
        <p>{note}</p>
      </div>
    </article>
  )
}
