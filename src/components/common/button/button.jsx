import styles from './button.module.css'

/**
 * Propiedades para el componente Button.
 * @typedef {object} ButtonProps
 * @property {React.ReactNode} children - Contenido dentro del botón.
 * @property {string} [className] - Clases CSS adicionales para el botón.
 * @property {"normal" | "destructive" | "secondary" | "colored"} [variant]
 * @property {function} [onClick] - Función a ejecutar al hacer click en el botón.
 * @property {React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} [props] - Propiedades del botón.
 */

/**
 * @param {ButtonProps} param0
 * @returns {React.ReactElement}
 */

export function Button({
  children,
  className,
  onClick,
  variant = 'normal',
  ...props
}) {
  return (
    <button
      data-variant={variant}
      onClick={onClick}
      className={`${styles.button} ${className ?? ''}`}
      {...props.props}>
      {children}
    </button>
  )
}
