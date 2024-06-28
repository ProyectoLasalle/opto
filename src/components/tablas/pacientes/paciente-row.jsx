import styles from './pacientes.module.css'

export function PacienteRow({
  apellido,
  email,
  nombre,
  active,
  habeasDataLoginAccepted,
  habeasDataTestsAccepted,
  handleClick,
  isSelected,
}) {
  return (
    <tr className={isSelected ? styles.selected : ''} onClick={handleClick}>
      <td className={styles.nombre}>
        {nombre} {apellido}
      </td>
      <td className={styles.email}>{email}</td>
      <td className={styles.status} data-text={active ? 'Activo' : 'Inactivo'}>
        {active ? 'Activo' : 'Inactivo'}
      </td>
      <td
        className={styles.habeasData}
        data-text={habeasDataLoginAccepted ? 'accepted' : 'not accepted'}>
        {habeasDataLoginAccepted ? 'Aceptó' : 'No aceptó'}
      </td>
      <td
        className={styles.habeasData}
        data-text={habeasDataTestsAccepted ? 'accepted' : 'not accepted'}>
        {habeasDataTestsAccepted ? 'Aceptó' : 'No aceptó'}
      </td>
    </tr>
  )
}
