import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from './useUser'
import { USER_POSSIBLE_STATES } from '../utils/user-possible-states'
import debounce from 'just-debounce-it'

const useAutoCloseSession = ({ secondsToLogout = 60 * 30 }) => {
  const [isLogoutModalShowing, setIsLogoutModalShowing] = useState(false)
  const [currentTimeWithoutMovingMouse, setCurrentTimeWithoutMovingMouse] =
    useState(0)

  const timerIdRef = useRef(null)
  const user = useUser()

  const resetTimeout = useCallback(
    debounce(
      () => {
        setCurrentTimeWithoutMovingMouse(0)
      },
      250,
      true,
    ),
    [currentTimeWithoutMovingMouse],
  )

  useEffect(() => {
    if (
      !window ||
      user === USER_POSSIBLE_STATES.NOT_KNOWN ||
      user === USER_POSSIBLE_STATES.NOT_LOGGED
    )
      return

    timerIdRef.current = setInterval(() => {
      setCurrentTimeWithoutMovingMouse((prev) => {
        if (prev >= secondsToLogout && !isLogoutModalShowing) {
          setIsLogoutModalShowing(true)
          return 0
        }
        return prev + 1
      })
    }, 1000)

    window.addEventListener('click', resetTimeout)
    document.addEventListener('visibilitychange', resetTimeout)

    return () => {
      clearInterval(timerIdRef.current)
      window.removeEventListener('click', resetTimeout)
      document.removeEventListener('visibilitychange', resetTimeout)
    }
  }, [user])

  const closeLogoutModal = () => {
    setIsLogoutModalShowing(false)
  }

  return { isLogoutModalShowing, closeLogoutModal }
}

export default useAutoCloseSession
