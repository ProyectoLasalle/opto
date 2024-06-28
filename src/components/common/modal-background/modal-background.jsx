import styles from './modal-background.module.css'

export function ModalBackground({
  closeModal = () => {},
  onClick = () => {},
  className,
  children,
  ...props
}) {
  const handleClick = () => {
    closeModal()
    onClick?.()
  }

  return (
    <div
      onClick={handleClick}
      id='modal-background'
      className={`${styles.modalBackground} ${className ?? ''}`}
      {...props}>
      {children}
    </div>
  )
}
