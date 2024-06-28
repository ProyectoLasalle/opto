import styles from './register.module.css'
import { useRegisterUser } from '../../../hooks/useRegisterUser'
import { Spinner } from '../../../components/spinner/spinner'
import { useUser } from '../../../hooks/useUser'
import { USER_POSSIBLE_STATES } from '../../../utils/user-possible-states'
import { useState } from 'react'
import { PatientRegisterForm } from './forms/patient'
import { DoctorRegisterForm } from './forms/doctor'
import { AdminRegisterForm } from './forms/admin'

const forms = {
  patient: <PatientRegisterForm />,
  doctor: <DoctorRegisterForm />,
  admin: <AdminRegisterForm />,
}

export function Register() {
  const [role, setRole] = useState('patient')
  const user = useUser()
  const { handleSubmit, handleImage, setImage, image, error, loading } =
    useRegisterUser()

  if (user === USER_POSSIBLE_STATES.NOT_KNOWN) {
    return (
      <div className={styles.loading}>
        <Spinner
          style={{
            color: 'var(--azul-profundo)',
            width: 20,
            height: 20,
            borderWidth: '2px',
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.main}>
      <section className={styles.imageSection}>
        {image ? (
          <img src={image.url} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        <div className={styles.buttonsContainer}>
          <input
            type='file'
            hidden
            id='image'
            accept='image/jpg image/png image/webp image/jpeg image/jfif'
            onChange={handleImage}
          />
          <label htmlFor='image'>Subir Imagen</label>
          {image && <button onClick={() => setImage(null)}>Quitar</button>}
        </div>
      </section>
      <section className={styles.dataSection}>
        <h1>Perfil</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor='role'>Rol*</label>
            <select
              name='role'
              id='role'
              onChange={(e) => setRole(e.target.value)}>
              <option value='patient'>Paciente</option>
              <option value='doctor'>Profesional</option>
              <option value='admin'>Administrador</option>
            </select>
          </div>
          {forms[role]}
          {error && <span style={{ color: 'red' }}>{error}</span>}
          <button type='submit' disabled={loading}>
            {loading ? (
              <Spinner
                style={{
                  color: 'black',
                  borderWidth: 2,
                  width: 10,
                  height: 10,
                }}
              />
            ) : (
              'Guardar'
            )}
          </button>
        </form>
      </section>

      <div className={styles.pageHolder} data-loading={loading}>
        {loading && (
          <Spinner
            style={{ height: 20, width: 20, color: 'rgb(var(--amarillo))' }}
          />
        )}
      </div>
    </div>
  )
}
