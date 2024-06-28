import styles from './home.module.css'

export function ImageEntry({ image }) {
  return (
    <div className={styles.imageContainer}>
      <img src={image} alt='Imágen de encabezado' />
    </div>
  )
}
