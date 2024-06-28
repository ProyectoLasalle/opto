import styles from './input-w-underline.module.css'

export function InputWUnderline({ textarea = false, ...props }) {
  return (
    <div className={styles.inputParent}>
      {textarea ? <textarea {...props} /> : <input {...props} />}
      <div className={styles.inputBrother} />
    </div>
  )
}
