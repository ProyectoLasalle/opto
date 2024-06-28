import { useState } from 'react'
import styles from './graphics.module.css'

export function Sidebar({ documents, setSelectedItemData, selectedItemData }) {
  const [showingMore, setShowingMore] = useState(false)

  const handleMoreClick = () => {
    setShowingMore((prev) => !prev)
  }

  return (
    <aside
      className={styles.aside}
      style={{ ...(showingMore && { maxHeight: 400 }) }}>
      <div className={styles.navTitle}>
        <p>Índice de Tests Realizados</p>
      </div>
      <div
        className={styles.buttonsContainer}
        style={{ ...(!showingMore && { overflow: 'hidden' }) }}>
        {documents.map((el, index) => {
          const i = index + 1
          return (
            <button
              data-selected={selectedItemData?.id === el?.id}
              key={i}
              onClick={() => setSelectedItemData(el)}>
              {i}
            </button>
          )
        })}
      </div>
      {documents.length >= 14 && (
        <button className={styles.more} onClick={handleMoreClick}>
          Ver más
        </button>
      )}
    </aside>
  )
}
