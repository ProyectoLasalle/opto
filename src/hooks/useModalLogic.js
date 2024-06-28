import { useEffect } from 'react'

export function useModalLogic ({ closeModal, scroll }) {
  useEffect(() => {
    const html = document.querySelector('html')
    if (html == null) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }

    html.addEventListener('keydown', onKeyDown)
    
    if (scroll) {
      html.style.overflow = 'hidden'
      html.style.paddingRight = '17px'
    }
    
    return () => {
      html.removeEventListener('keydown', onKeyDown)
      if (scroll) {
        html.style.overflow = 'auto'
        html.style.paddingRight = '0'
      }
    }
  }, [])

}