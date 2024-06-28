import styles from './user-profile.module.css'
import { useGetUserPage } from '../../hooks/useGetUserPage'
import { Spinner } from '../spinner/spinner'
import { UserEntry } from './user-entry'
import { NamesEntry } from './names-entry'
import { PasswordModal } from '../modals/password-modal/password-modal'
import { DeleteIcon } from '../icons/delete'
import { DeleteModal } from '../modals/delete-modal/delete-modal'

const parsedRole = {
  patient: 'Paciente',
  doctor: 'Profesional',
  admin: 'Administrador',
}

export function UserProfile({ id, type, closeProfileModal, deletePatient }) {
  const {
    pageUser: user,
    loggedUser,
    loading,
    error,
    inputRef,
    entrys,
    editedFields,
    success,
    updateLoading,
    image,
    passwordEditing,
    deleting,
    setDeleting,
    handleImage,
    handleImageClear,
    setEditedFields,
    handleSubmit,
    setPasswordEditing,
    handleDeleteImage,
  } = useGetUserPage({ id, type })


  return (
    <>
      <section className={styles.userContainer}>
        {loading ? (
          <div className={styles.loading}>
            <Spinner
              style={{
                color: 'var(--azul-profundo)',
                borderWidth: 2,
                height: 20,
                width: 20,
              }}
            />
          </div>
        ) : error ? (
          <div
            className={styles.loading}
            style={{ textAlign: 'center', color: 'red' }}>
            <span>Ocurrió un error inesperado:</span>
            <p>{error}</p>
            <p>
              Puede que el usuario al que estas tratando de acceder <br /> no
              exista en la base de datos.
            </p>
          </div>
        ) : (
          <>
            {loggedUser.role === 'admin' || id === loggedUser?.id ? (
              <NamesEntry
                setEditedFields={setEditedFields}
                nombre={user.nombre}
                apellido={user.apellido}
                success={success}
                role={user.role}
              />
            ) : (
              <div className={styles.nameContainer}>
                <h1>
                  {user.role === 'doctor' ? 'Profesional' : ''} {user.nombre}{' '}
                  {user.apellido}
                </h1>
                <p>{parsedRole[user.role] ?? ''}</p>
              </div>
            )}

            <div className={styles.imageSide}>
              {image?.src ? (
                <img
                  src={image.src}
                  alt='Nueva foto de perfil'
                  height={200}
                  width={200}
                />
              ) : user?.image?.src ? (
                <img
                  src={user.image.src}
                  alt='Foto de perfil del usuario'
                  height={200}
                  width={200}
                />
              ) : (
                <div className={styles.imagePlaceholder} />
              )}
              {(loggedUser.role === 'admin' || loggedUser.id === id) && (
                <div className={styles.buttonsContainer}>
                  <input
                    type='file'
                    ref={inputRef}
                    hidden
                    id='image'
                    accept='image/jpg image/png image/webp image/jpeg image/jfif'
                    onChange={handleImage}
                  />
                  <label htmlFor='image'>Subir Imagen</label>
                  {image && <button onClick={handleImageClear}>Quitar</button>}
                  {user.image && (
                    <button onClick={handleDeleteImage}>Borrar imágen</button>
                  )}
                </div>
              )}
            </div>
            <div className={styles.dataSide}>
              {entrys.map((el) => {
                return (
                  <UserEntry
                    key={el.slug}
                    id={id}
                    success={success}
                    setEditedFields={setEditedFields}
                    {...el}>
                    {el.element}
                  </UserEntry>
                )
              })}
              {(loggedUser.role === 'admin' || loggedUser.id === id) && (
                <button
                  className={styles.changePassword}
                  onClick={() => setPasswordEditing(true)}>
                  Cambiar contraseña
                </button>
              )}
            </div>
            {loggedUser.role === 'admin' && (
              <button
                className={styles.delete}
                onClick={() => setDeleting(true)}
                title='Borrar usuario'>
                <DeleteIcon width={23} height={23} strokeWidth={1} />
              </button>
            )}
          </>
        )}
        {(Object.entries(editedFields).length >= 1 || image !== null) && (
          <button
            className={styles.saveButton}
            disabled={updateLoading}
            onClick={handleSubmit}>
            {updateLoading ? (
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
        )}
      </section>
      {passwordEditing && (
        <PasswordModal closeModal={() => setPasswordEditing(false)} id={id} />
      )}
      {deleting && (
        <DeleteModal
          closeModal={() => setDeleting(false)}
          user={user}
          closeProfileModal={closeProfileModal}
          deletePatient={deletePatient}
        />
      )}
    </>
  )
}
