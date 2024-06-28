import { useEffect, useState } from 'react'
import styles from './user-profile.module.css'
import { EditIcon } from '../icons/edit'
import { useUser } from '../../hooks/useUser'

export function UserEntry({
  children,
  id,
  success,
  name,
  notEditable,
  setEditedFields,
  slug,
  value,
  type,
  options,
  inputType = 'text',
  visibleOnlyToOwn = true,
  visibleToOwn = true,
}) {
  const user = useUser()

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (success) setEditing(false)
  }, [success])

  const handleCancel = () => {
    setEditedFields((prev) => {
      const newState = { ...prev }
      delete newState[slug]
      return newState
    })
    setEditing(false)
  }
  const handleChange = (e) => {
    setEditedFields((prev) => {
      if (e.target.value === value) {
        const newState = { ...prev }
        delete newState[slug]
        return newState
      } else {
        return { ...prev, [slug]: e.target.value }
      }
    })
  }
  if (!visibleToOwn && user.id === id && user.role !== 'admin') return
  if (visibleOnlyToOwn && user.id !== id && user.role !== 'admin') return

  return (
    <div className={styles.entry}>
      <label>{name}</label>
      {!editing ? (
        <>
          <div className={styles.dataContainer}>{children}</div>
          {!notEditable && (user?.id === id || user?.role === 'admin') && (
            <button className={styles.edit} onClick={() => setEditing(true)}>
              <EditIcon height={25} width={25} style={{ strokeWidth: 2 }} />
            </button>
          )}
        </>
      ) : (
        <>
          {type === 'select' ? (
            <select
              defaultValue={value}
              onChange={(e) => {
                setEditedFields((prev) => ({
                  ...prev,
                  [slug]: e.target.value === 'true',
                }))
              }}>
              {options.map((el) => {
                return (
                  <option key={el.value} value={el.value}>
                    {el.text}
                  </option>
                )
              })}
            </select>
          ) : (
            <input
              type={inputType}
              spellCheck={false}
              autoFocus
              name={slug}
              defaultValue={value}
              onChange={handleChange}
            />
          )}

          <button className={styles.cancel} onClick={handleCancel}>
            Cancelar
          </button>
        </>
      )}
    </div>
  )
}
