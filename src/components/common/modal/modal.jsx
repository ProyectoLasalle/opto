import styles from './modal.module.css'

/**
 * Propiedades para el componente Modal.
 * @typedef {object} ModalProps
 * @property {React.ReactNode} children - Contenido dentro del modal.
 * @property {string} [className] - Clases CSS adicionales para el modal.
 * @property {boolean} [propagate=true] - Indica si se debe propagar el evento click.
 * @property {boolean} [fadeWithTranslate=true] - Indica si el modal debe tener una animación de desvanecimiento con traducción.
 * @property {function} [onClick] - Función llamada cuando se hace clic en el modal.
 */

/**
 * Componente de modal reutilizable.
 * @param {ModalProps} props - Propiedades del modal.
 * @returns {React.ReactElement} Elemento de modal.
 */
function Modal({
  children,
  className,
  propagate = true,
  fadeWithTranslate = true,
  onClick,
  ...props
}) {
  /**
   * Maneja el evento click del modal.
   * @param {React.MouseEvent} e - Objeto de evento de clic.
   */
  const handleClick = (e) => {
    propagate && e.stopPropagation()
    onClick?.(e)
  }

  return (
    <div
      className={`${styles.modal} ${
        fadeWithTranslate ? styles.fadeWithTranslate : ''
      } ${className ?? ''}`}
      onClick={handleClick}
      role='dialog'
      {...props}>
      {children}
    </div>
  )
}

/**
 * Propiedades para el componente ModalBackground.
 * @typedef {object} ModalBackgroundProps
 * @property {function} [closeModal] - Función para cerrar el modal.
 * @property {function} [onClick] - Función llamada cuando se hace clic en el fondo del modal.
 * @property {string} [className] - Clases CSS adicionales para el fondo del modal.
 * @property {React.ReactNode} children - Contenido dentro del fondo del modal.
 */

/**
 * Componente de fondo para el modal.
 * @param {ModalBackgroundProps} props - Propiedades del fondo del modal.
 * @returns {React.ReactElement} Elemento de fondo del modal.
 */
function ModalBackground({
  closeModal = () => {},
  onClick = () => {},
  className,
  children,
  ...props
}) {
  /**
   * Maneja el evento click en el fondo del modal.
   */
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

/**
 * Propiedades para el componente ModalTitle.
 * @typedef {object} ModalTitleProps
 * @property {React.ReactNode} children - Contenido dentro del título del modal.
 * @property {string} [className] - Clases CSS adicionales para el título del modal.
 */

/**
 * Componente de título para el modal.
 * @param {ModalTitleProps} props - Propiedades del título del modal.
 * @returns {React.ReactElement} Elemento de título del modal.
 */
function ModalTitle({ children, className, ...props }) {
  return (
    <h3 className={`${styles.title} ${className ?? ''}`} {...props}>
      {children}
    </h3>
  )
}

/**
 * Propiedades para el componente ModalText.
 * @typedef {object} ModalTextProps
 * @property {React.ReactNode} children - Contenido dentro del texto del modal.
 * @property {string} [className] - Clases CSS adicionales para el texto del modal.
 */

/**
 * Componente de texto para el modal.
 * @param {ModalTextProps} props - Propiedades del texto del modal.
 * @returns {React.ReactElement} Elemento de texto del modal.
 */
function ModalText({ children, className, ...props }) {
  return (
    <p className={`${styles.text} ${className ?? ''}`} {...props}>
      {children}
    </p>
  )
}

/**
 * Propiedades para el componente ModalBody.
 * @typedef {object} ModalBodyProps
 * @property {React.ReactNode} children - Contenido dentro del cuerpo del modal.
 * @property {boolean} [row=false] - Indica si el cuerpo del modal debe estar en una fila.
 * @property {string} [className] - Clases CSS adicionales para el cuerpo del modal.
 */

/**
 * Componente de cuerpo para el modal.
 * @param {ModalBodyProps} props - Propiedades del cuerpo del modal.
 * @returns {React.ReactElement} Elemento de cuerpo del modal.
 */
function ModalBody({ children, row = false, className, ...props }) {
  return (
    <div
      data-variant={row ? 'row' : 'col'}
      className={`${styles.body} ${className ?? ''}`}
      {...props}>
      {children}
    </div>
  )
}

/**
 * Propiedades para el componente ModalFooter.
 * @typedef {object} ModalFooterProps
 * @property {React.ReactNode} children - Contenido dentro del pie de página del modal.
 * @property {boolean} [col=false] - Indica si el pie de página del modal debe estar en una columna.
 * @property {string} [className] - Clases CSS adicionales para el pie de página del modal.
 */

/**
 * Componente de pie de página para el modal.
 * @param {ModalFooterProps} props - Propiedades del pie de página del modal.
 * @returns {React.ReactElement} Elemento de pie de página del modal.
 */
function ModalFooter({ children, col = false, className, ...props }) {
  return (
    <div
      data-variant={col ? 'col' : 'row'}
      className={`${styles.footer} ${className ?? ''}`}
      {...props}>
      {children}
    </div>
  )
}

// Objeto que combina el componente Modal con sus subcomponentes.
const ModalWithSubcomponents = Object.assign(Modal, {
  Background: ModalBackground,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
  Text: ModalText,
})

export { ModalWithSubcomponents as Modal }
