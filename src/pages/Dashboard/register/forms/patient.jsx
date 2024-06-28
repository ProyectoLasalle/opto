import styles from '../register.module.css'

export function PatientRegisterForm() {
  return (
    <>
      <div className={styles.inputContainer}>
        <label htmlFor='nombre'>Nombre*</label>
        <input
          type='text'
          required
          id='nombre'
          name='nombre'
          placeholder='Pepito'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='apellido'>Apellido*</label>
        <input
          type='text'
          required
          id='apellido'
          name='apellido'
          placeholder='Perez'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='documento'>Documento</label>
        <input
          type='number'
          required
          id='documento'
          name='documento'
          placeholder='12345678'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='edad'>Edad*</label>
        <input type='number' id='edad' required name='edad' placeholder='18' />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='ocupacion'>Ocupación</label>
        <input
          type='text'
          id='ocupacion'
          name='ocupacion'
          placeholder='Carpintero'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='direccion'>Dirección*</label>
        <input
          type='text'
          required
          id='direccion'
          name='direccion'
          placeholder='Av. Libertador al 5000'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='telefono'>Teléfono*</label>
        <input
          type='text'
          required
          id='telefono'
          name='telefono'
          placeholder='12345678'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='nombre_acudiente'>
          Nombre de acudiente (para niños)
        </label>
        <input
          type='text'
          id='nombre_acudiente'
          name='nombre_acudiente'
          placeholder='Juan Perez'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='telefono_acudiente'>
          Teléfono de acudiente (para niños)
        </label>
        <input
          type='number'
          id='telefono_acudiente'
          name='telefono_acudiente'
          placeholder='123456789'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='ultimo_control'>Fecha de último control</label>
        <input
          type='date'
          id='ultimo_control'
          name='ultimo_control'
          defaultValue={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='email'>Email*</label>
        <input
          type='email'
          required
          id='email'
          name='email'
          placeholder='pepito@gmail.com'
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor='password'>Contraseña*</label>
        <input
          type='password'
          minLength={6}
          required
          id='password'
          name='password'
          placeholder=''
        />
      </div>
    </>
  )
}
