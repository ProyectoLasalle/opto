import { useEffect, useState } from 'react'
import styles from './user-profile.module.css'
import { EditIcon } from '../icons/edit'

const parsedRole = {
  patient: 'Paciente',
  doctor: 'Profesional',
  admin: 'Administrador',
}

export function NamesEntry({
  setEditedFields,
  nombre,
  apellido,
  role,
  success,
}) {
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (success) setEditing(false)
  }, [success])

  const handleCancel = (name) => {
    setEditedFields((prev) => {
      const newState = { ...prev }
      delete newState[name]
      return newState
    })
    setEditing(false)
  }

  const handleChange = (e) => {
    const propValue = e.target.name === 'nombre' ? nombre : apellido

    setEditedFields((prev) => {
      if (e.target.value === propValue) {
        const newState = { ...prev }
        delete newState[e.target.name]
        return newState
      } else {
        return { ...prev, [e.target.name]: e.target.value }
      }
    })
  }
  return (
    <div className={styles.nameContainer}>
      {editing ? (
        <div className={styles.nameEditing}>
          <input
            type='text'
            name='nombre'
            placeholder='Nombre'
            onChange={handleChange}
            defaultValue={nombre}
            id='nombre'
            className={styles.nameInput}
          />
          <input
            type='text'
            name='apellido'
            placeholder='Apellido'
            onChange={handleChange}
            defaultValue={apellido}
            id='apellido'
            className={styles.nameInput}
          />
          <button className={styles.cancel} onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>
              {nombre} {apellido}
            </h1>
            <button
              className={styles.edit}
              style={{ marginLeft: 10, alignSelf: 'center' }}
              onClick={() => setEditing(true)}>
              <EditIcon height={25} width={25} style={{ strokeWidth: 2 }} />
            </button>
          </div>
          <p>{parsedRole[role] ?? ''}</p>
        </>
      )}
    </div>
  )
}
