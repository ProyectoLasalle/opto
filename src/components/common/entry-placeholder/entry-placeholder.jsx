import styles from './entry-placeholder.module.css'

export function EntryPlaceholder({ width, height = 24, style = {} }) {
  return (
    <div
      className={styles.skeleton}
      style={{
        width,
        height,
        backgroundImage:
          'linear-gradient(90deg, rgba(50,50,50, 0), rgba(250,250,250, 0.5), rgba(50,50,50, 0))',
        backgroundSize: `${width}px 100%`,
        ...style,
      }}
    ></div>
  )
}
