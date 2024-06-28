import { useModalLogic } from '../../../hooks/useModalLogic'
import { UserProfile } from '../../user-profile/user-profile'
import styles from './profile-modal.module.css'

export function ProfileModal({
  selectedRowId,
  setIsEditing,
  deletePatient,
  type,
}) {
  useModalLogic({ closeModal: () => setIsEditing(false), scroll: true })

  return (
    <div className={styles.modalContainer} onClick={() => setIsEditing(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        <UserProfile
          id={selectedRowId}
          type={type}
          closeProfileModal={() => setIsEditing(false)}
          deletePatient={deletePatient}
        />
      </div>
    </div>
  )
}
